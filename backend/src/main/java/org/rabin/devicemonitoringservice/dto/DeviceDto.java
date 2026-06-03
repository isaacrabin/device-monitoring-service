package org.rabin.devicemonitoringservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.rabin.devicemonitoringservice.entity.DeviceStatus;
import org.rabin.devicemonitoringservice.entity.DeviceType;

import java.time.Instant;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DeviceDto {
    private UUID id;

    @NotBlank(message = "Device name is required")
    private String name;

    @NotNull(message = "Device type is required")
    private DeviceType deviceType;

    private String hostname;

    @Pattern(regexp = "^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$",
            message = "Invalid IP address format")
    private String ipAddress;

    private String location;
    private Instant registeredAt;
    private DeviceStatus lastStatus;
    private Instant lastReportTimestamp;
    private Boolean isStale;
}
