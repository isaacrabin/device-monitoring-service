package org.rabin.devicemonitoringservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DeviceDetailDto {
    private DeviceDto device;
    private List<StatusReportDto> recentReports;
}
