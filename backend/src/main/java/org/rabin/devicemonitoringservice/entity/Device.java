package org.rabin.devicemonitoringservice.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.type.SqlTypes;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "device")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Device {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(name = "device_type", nullable = false)
    private DeviceType deviceType;

    private String hostname;

    @Column(name = "ip_address")
    private String ipAddress;

    private String location;

    @CreationTimestamp
    @Column(name = "registered_at", nullable = false)
    private Instant registeredAt;

    @Enumerated(EnumType.STRING)
    @Column(name = "last_status", nullable = false)
    private DeviceStatus lastStatus;

    @Column(name = "last_report_timestamp")
    private Instant lastReportTimestamp;

    @Column(name = "last_diagnostic_message")
    private String lastDiagnosticMessage;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;
}
