package org.rabin.devicemonitoringservice.service;

import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.ratelimiter.RequestNotPermitted;
import io.github.resilience4j.ratelimiter.annotation.RateLimiter;
import io.github.resilience4j.retry.annotation.Retry;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.rabin.devicemonitoringservice.dto.DeviceDetailDto;
import org.rabin.devicemonitoringservice.dto.DeviceDto;
import org.rabin.devicemonitoringservice.dto.StatusReportDto;
import org.rabin.devicemonitoringservice.dto.StatusReportRequest;
import org.rabin.devicemonitoringservice.entity.Device;
import org.rabin.devicemonitoringservice.entity.DeviceStatus;
import org.rabin.devicemonitoringservice.entity.StatusReport;
import org.rabin.devicemonitoringservice.exception.DeviceNotFoundException;
import org.rabin.devicemonitoringservice.exception.DuplicateDeviceException;
import org.rabin.devicemonitoringservice.exception.RateLimitExceededException;
import org.rabin.devicemonitoringservice.exception.ServiceUnavailableException;
import org.rabin.devicemonitoringservice.repository.DeviceRepository;
import org.rabin.devicemonitoringservice.repository.StatusReportRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DataAccessException;
import org.springframework.data.domain.PageRequest;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class DeviceService {

    private final DeviceRepository deviceRepository;
    private final StatusReportRepository statusReportRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @Value("${monitoring.staleness.threshold-minutes:15}")
    private int stalenessThresholdMinutes;

    @Transactional
    @Retry(name = "registerDevice", fallbackMethod = "registerDeviceFallback")
    @CircuitBreaker(name = "deviceService", fallbackMethod = "registerDeviceFallback")
    public DeviceDto registerDevice(DeviceDto deviceDto) {
        log.info("Registering new device name={} type={} location={}",
                deviceDto.getName(), deviceDto.getDeviceType(), deviceDto.getLocation());

        if (deviceRepository.existsByName(deviceDto.getName())) {
            log.warn("Duplicate device name attempted: {}", deviceDto.getName());
            throw new DuplicateDeviceException(
                    "Device with name '" + deviceDto.getName() + "' already exists");
        }

        Device device = Device.builder()
                .name(deviceDto.getName())
                .deviceType(deviceDto.getDeviceType())
                .hostname(deviceDto.getHostname())
                .ipAddress(deviceDto.getIpAddress())
                .location(deviceDto.getLocation())
                .lastStatus(DeviceStatus.UNKNOWN)
                .build();

        Device savedDevice = deviceRepository.save(device);
        log.info("Device registered successfully id={}", savedDevice.getId());

        DeviceDto savedDeviceDto = convertToDto(savedDevice);

        // WEBSOCKET BROADCAST FOR DEVICE REGISTRATION
        messagingTemplate.convertAndSend("/topic/device-registrations", savedDeviceDto);
        log.debug("Broadcasted device registration via WebSocket: {}", savedDeviceDto.getName());

        return savedDeviceDto;
    }


    public DeviceDto registerDeviceFallback(DeviceDto deviceDto, DataAccessException ex) {
        log.error("registerDevice fallback triggered for name={} after retries exhausted. cause={}",
                deviceDto.getName(), ex.getMessage());
        throw new ServiceUnavailableException(
                "Unable to register device at this time. Please try again shortly.");
    }

    public DeviceDto registerDeviceFallback(DeviceDto deviceDto, Exception ex) {
        log.error("registerDevice circuit breaker fallback triggered for name={} cause={}",
                deviceDto.getName(), ex.getMessage());
        throw new ServiceUnavailableException(
                "Service temporarily unavailable. Please try again shortly.");
    }

    @Transactional
    @RateLimiter(name = "statusReport", fallbackMethod = "submitStatusReportRateLimitFallback")
    @Retry(name = "submitStatusReport", fallbackMethod = "submitStatusReportFallback")
    public StatusReportDto submitStatusReport(UUID deviceId, StatusReportRequest request) {
        log.debug("Status report received deviceId={} status={}", deviceId, request.getStatus());

        Device device = deviceRepository.findById(deviceId)
                .orElseThrow(() -> {
                    log.warn("Status report rejected — unknown deviceId={}", deviceId);
                    return new DeviceNotFoundException("Device not found with ID: " + deviceId);
                });

        Instant now = Instant.now();

        StatusReport report = StatusReport.builder()
                .deviceId(deviceId)
                .reportedAt(now)
                .status(request.getStatus())
                .diagnosticMessage(request.getDiagnosticMessage())
                .build();

        statusReportRepository.save(report);

        device.setLastStatus(request.getStatus());
        device.setLastReportTimestamp(now);
        device.setLastDiagnosticMessage(request.getDiagnosticMessage());
        deviceRepository.save(device);

        // WEBSOCKET BROADCAST FOR STATUS REPORT
        StatusReportDto reportDto = convertToDto(report);
        messagingTemplate.convertAndSend("/topic/status-updates", reportDto);
        log.debug("Broadcasted status report via WebSocket for deviceId={}, status={}", deviceId, request.getStatus());

        // ADD WEBSOCKET BROADCAST FOR DEVICE STATUS CHANGE
        DeviceDto deviceDto = convertToDto(device);
        deviceDto.setIsStale(isDeviceStale(device, Instant.now().minusSeconds(stalenessThresholdMinutes * 60L)));
        messagingTemplate.convertAndSend("/topic/device-status-changes", deviceDto);
        log.debug("Broadcasted device status change via WebSocket for deviceId={}", deviceId);

        if (request.getStatus() == DeviceStatus.OFFLINE
                || request.getStatus() == DeviceStatus.DEGRADED) {
            log.warn("Device in degraded state deviceId={} status={} message={}",
                    deviceId, request.getStatus(), request.getDiagnosticMessage());
        } else {
            log.info("Status report saved deviceId={} status={}", deviceId, request.getStatus());
        }

        return reportDto;
    }


    public StatusReportDto submitStatusReportRateLimitFallback(
            UUID deviceId, StatusReportRequest request, RequestNotPermitted ex) {
        log.warn("Rate limit exceeded deviceId={}", deviceId);
        throw new RateLimitExceededException(
                "Rate limit exceeded for device " + deviceId + ". Max 10 reports per minute.");
    }

    /**
     * Fallback when all retry attempts are exhausted on a transient DB error.
     */
    public StatusReportDto submitStatusReportFallback(
            UUID deviceId, StatusReportRequest request, DataAccessException ex) {
        log.error("submitStatusReport fallback triggered deviceId={} cause={}",
                deviceId, ex.getMessage());
        throw new ServiceUnavailableException(
                "Unable to persist status report at this time. Please retry.");
    }

    // ── List All Devices ──────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public List<DeviceDto> getAllDevices() {
        log.debug("Fetching all devices");
        Instant staleThreshold = Instant.now().minusSeconds(stalenessThresholdMinutes * 60L);

        return deviceRepository.findAll().stream()
                .map(device -> {
                    DeviceDto dto = convertToDto(device);
                    dto.setIsStale(isDeviceStale(device, staleThreshold));
                    return dto;
                })
                .collect(Collectors.toList());
    }

    // ── Get Device Detail ─────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public DeviceDetailDto getDeviceDetails(UUID deviceId) {
        log.debug("Fetching device details for deviceId={}", deviceId);

        Device device = deviceRepository.findById(deviceId)
                .orElseThrow(() -> new DeviceNotFoundException(
                        "Device not found with ID: " + deviceId));

        Instant staleThreshold = Instant.now().minusSeconds(stalenessThresholdMinutes * 60L);
        DeviceDto deviceDto = convertToDto(device);
        deviceDto.setIsStale(isDeviceStale(device, staleThreshold));

        // Fetch only the 20 most recent reports — not the full history
        List<StatusReport> recentReports = statusReportRepository
                .findByDeviceIdOrderByReportedAtDesc(deviceId, PageRequest.of(0, 20));

        List<StatusReportDto> reportDtos = recentReports.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());

        return DeviceDetailDto.builder()
                .device(deviceDto)
                .recentReports(reportDtos)
                .build();
    }

    // ── Private Helpers ───────────────────────────────────────────────────────

    private boolean isDeviceStale(Device device, Instant staleThreshold) {
        // A device that has never reported is also considered stale
        return device.getLastReportTimestamp() == null
                || device.getLastReportTimestamp().isBefore(staleThreshold);
    }

    private DeviceDto convertToDto(Device device) {
        return DeviceDto.builder()
                .id(device.getId())
                .name(device.getName())
                .deviceType(device.getDeviceType())
                .hostname(device.getHostname())
                .ipAddress(device.getIpAddress())
                .location(device.getLocation())
                .registeredAt(device.getRegisteredAt())
                .lastStatus(device.getLastStatus())
                .lastReportTimestamp(device.getLastReportTimestamp())
                .build();
    }

    private StatusReportDto convertToDto(StatusReport report) {
        return StatusReportDto.builder()
                .id(report.getId())
                .reportedAt(report.getReportedAt())
                .status(report.getStatus())
                .diagnosticMessage(report.getDiagnosticMessage())
                .build();
    }
}
