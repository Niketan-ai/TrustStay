package com.truststay.repository;

import com.truststay.entity.Property;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface PropertyRepository extends JpaRepository<Property, Long> {

    List<Property> findByIsActiveTrue();

    @Query("SELECT p FROM Property p WHERE p.isActive = true " +
           "AND (:city IS NULL OR LOWER(p.city) LIKE LOWER(CONCAT('%', :city, '%'))) " +
           "AND (:propertyType IS NULL OR p.propertyType = :propertyType) " +
           "AND (:maxRent IS NULL OR p.rentAmount <= :maxRent) " +
           "AND (:genderPreference IS NULL OR p.genderPreference = :genderPreference)")
    Page<Property> searchProperties(
        @Param("city") String city,
        @Param("propertyType") String propertyType,
        @Param("maxRent") BigDecimal maxRent,
        @Param("genderPreference") String genderPreference,
        Pageable pageable
    );

    List<Property> findByOwnerId(Long ownerId);
}
