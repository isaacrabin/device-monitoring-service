package org.rabin.devicemonitoringservice.repository;

import org.rabin.devicemonitoringservice.entity.StatusReport;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Repository
public interface StatusReportRepository extends JpaRepository<StatusReport, Long> {

    List<StatusReport> findByDeviceIdOrderByReportedAtDesc(UUID deviceId, PageRequest pageRequest);

    @Modifying
    @Transactional
    @Query("DELETE FROM StatusReport sr WHERE sr.reportedAt < :cutoffDate")
    int deleteOldReports(@Param("cutoffDate") Instant cutoffDate);

    long countByDeviceIdAndReportedAtAfter(UUID deviceId, Instant since);
}
