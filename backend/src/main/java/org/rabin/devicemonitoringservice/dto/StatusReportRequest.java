package org.rabin.devicemonitoringservice.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.rabin.devicemonitoringservice.entity.DeviceStatus;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StatusReportRequest {
    @NotNull(message = "Status is required")
    private DeviceStatus status;
    private String diagnosticMessage;
}
