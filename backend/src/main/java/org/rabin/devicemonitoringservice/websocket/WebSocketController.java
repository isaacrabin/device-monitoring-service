package org.rabin.devicemonitoringservice.websocket;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.rabin.devicemonitoringservice.dto.DeviceDto;
import org.rabin.devicemonitoringservice.dto.StatusReportDto;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
@Slf4j
public class WebSocketController {

    @MessageMapping("/device.status")
    @SendTo("/topic/status-updates")
    public StatusReportDto broadcastStatusUpdate(StatusReportDto statusReport) {
        log.debug("Broadcasting status update via WebSocket for device: {}", statusReport);
        return statusReport;
    }

    @MessageMapping("/device.registration")
    @SendTo("/topic/device-registrations")
    public DeviceDto broadcastDeviceRegistration(DeviceDto device) {
        log.debug("Broadcasting device registration via WebSocket: {}", device.getName());
        return device;
    }
}
