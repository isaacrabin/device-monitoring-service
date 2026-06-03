package org.rabin.devicemonitoringservice.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.rabin.devicemonitoringservice.dto.*;
import org.rabin.devicemonitoringservice.service.DeviceService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/devices")
@RequiredArgsConstructor
@Slf4j
public class DeviceController {

    private final DeviceService deviceService;

    @PostMapping
    public ResponseEntity<ApiResponse<DeviceDto>> registerDevice(@Valid @RequestBody DeviceDto deviceDto) {
        log.info("POST /api/devices - Register device request received");
        DeviceDto createdDevice = deviceService.registerDevice(deviceDto);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success(createdDevice, "Device registered successfully"));
    }

    @PostMapping("/{deviceId}/status")
    public ResponseEntity<ApiResponse<StatusReportDto>> submitStatusReport(
            @PathVariable UUID deviceId,
            @Valid @RequestBody StatusReportRequest request) {
        log.info("POST /api/devices/{}/status - Status update received", deviceId);
        StatusReportDto report = deviceService.submitStatusReport(deviceId, request);
        return ResponseEntity.ok(ApiResponse.success(report, "Status report submitted successfully"));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<DeviceDto>>> getAllDevices() {
        log.info("GET /api/devices - Fetching all devices");
        List<DeviceDto> devices = deviceService.getAllDevices();
        return ResponseEntity.ok(ApiResponse.success(devices));
    }

    @GetMapping("/{deviceId}")
    public ResponseEntity<ApiResponse<DeviceDetailDto>> getDeviceDetails(@PathVariable UUID deviceId) {
        log.info("GET /api/devices/{} - Fetching device details", deviceId);
        DeviceDetailDto deviceDetails = deviceService.getDeviceDetails(deviceId);
        return ResponseEntity.ok(ApiResponse.success(deviceDetails));
    }
}
