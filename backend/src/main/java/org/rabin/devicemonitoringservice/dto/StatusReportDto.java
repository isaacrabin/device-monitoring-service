package org.rabin.devicemonitoringservice.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.rabin.devicemonitoringservice.entity.DeviceStatus;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StatusReportDto {
    private Long id;
    private Instant reportedAt;

    @NotNull(message = "Status is required")
    private DeviceStatus status;

    private String diagnosticMessage;
}

