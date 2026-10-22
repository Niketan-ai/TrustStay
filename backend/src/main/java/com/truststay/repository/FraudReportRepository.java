package com.truststay.repository;

import com.truststay.entity.FraudReport;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FraudReportRepository extends JpaRepository<FraudReport, Long> {
    Page<FraudReport> findAllByOrderByCreatedAtDesc(Pageable pageable);
    Page<FraudReport> findByStatusOrderByCreatedAtDesc(String status, Pageable pageable);
    Page<FraudReport> findByReporterIdOrderByCreatedAtDesc(Long reporterId, Pageable pageable);
    long countByStatus(String status);
}
