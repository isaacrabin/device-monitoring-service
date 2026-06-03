package org.rabin.devicemonitoringservice.repository;

import org.rabin.devicemonitoringservice.entity.Device;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Repository
public interface DeviceRepository extends JpaRepository<Device, UUID> {

    @Query("SELECT d FROM Device d WHERE " +
            "d.lastReportTimestamp IS NULL OR " +
            "d.lastReportTimestamp < :staleThreshold")
    List<Device> findStaleDevices(@Param("staleThreshold") Instant staleThreshold);

    @Query("SELECT d FROM Device d WHERE d.deviceType = :type")
    Page<Device> findByDeviceType(@Param("type") String type, Pageable pageable);

    boolean existsByName(String name);
}
