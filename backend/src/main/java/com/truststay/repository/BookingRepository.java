package com.truststay.repository;

import com.truststay.entity.Booking;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByTenantIdOrderByCreatedAtDesc(Long tenantId);

    @Query("SELECT b FROM Booking b WHERE b.property.owner.id = :ownerId ORDER BY b.createdAt DESC")
    List<Booking> findByPropertyOwnerIdOrderByCreatedAtDesc(@Param("ownerId") Long ownerId);

    @Query("SELECT b FROM Booking b WHERE b.property.owner.id = :ownerId AND b.status = :status ORDER BY b.createdAt DESC")
    Page<Booking> findByPropertyOwnerIdAndStatus(@Param("ownerId") Long ownerId, @Param("status") String status, Pageable pageable);

    long countByStatus(String status);
}
