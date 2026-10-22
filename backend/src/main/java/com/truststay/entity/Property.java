package com.truststay.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Entity
@Table(name = "properties")
public class Property {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(name = "property_type", nullable = false, length = 50)
    private String propertyType; // APARTMENT, HOSTEL, PG_CO_LIVING, STUDIO

    @Column(name = "target_tenant_type", nullable = false, length = 50)
    private String targetTenantType; // STUDENTS_ONLY, PROFESSIONALS_ONLY, ANY

    @Column(name = "gender_preference", nullable = false, length = 30)
    private String genderPreference; // FEMALE_ONLY, MALE_ONLY, CO_ED

    @Column(name = "rent_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal rentAmount;

    @Column(name = "deposit_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal depositAmount;

    @Column(name = "address_line1", nullable = false, length = 255)
    private String addressLine1;

    @Column(nullable = false, length = 100)
    private String city;

    @Column(nullable = false, length = 100)
    private String state;

    @Column(name = "postal_code", nullable = false, length = 20)
    private String postalCode;

    @Column(name = "cctv_present", nullable = false)
    private Boolean cctvPresent = false;

    @Column(name = "security_guard", nullable = false)
    private Boolean securityGuard = false;

    @Column(name = "biometric_access", nullable = false)
    private Boolean biometricAccess = false;

    @Column(name = "curfew_time", length = 50)
    private String curfewTime;

    @Column(name = "verification_status", nullable = false, length = 30)
    private String verificationStatus = "UNVERIFIED";

    @Column(name = "safety_score", nullable = false)
    private Integer safetyScore = 50;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt = OffsetDateTime.now();

    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt = OffsetDateTime.now();

    public Property() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getOwner() {
        return owner;
    }

    public void setOwner(User owner) {
        this.owner = owner;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getPropertyType() {
        return propertyType;
    }

    public void setPropertyType(String propertyType) {
        this.propertyType = propertyType;
    }

    public String getTargetTenantType() {
        return targetTenantType;
    }

    public void setTargetTenantType(String targetTenantType) {
        this.targetTenantType = targetTenantType;
    }

    public String getGenderPreference() {
        return genderPreference;
    }

    public void setGenderPreference(String genderPreference) {
        this.genderPreference = genderPreference;
    }

    public BigDecimal getRentAmount() {
        return rentAmount;
    }

    public void setRentAmount(BigDecimal rentAmount) {
        this.rentAmount = rentAmount;
    }

    public BigDecimal getDepositAmount() {
        return depositAmount;
    }

    public void setDepositAmount(BigDecimal depositAmount) {
        this.depositAmount = depositAmount;
    }

    public String getAddressLine1() {
        return addressLine1;
    }

    public void setAddressLine1(String addressLine1) {
        this.addressLine1 = addressLine1;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getPostalCode() {
        return postalCode;
    }

    public void setPostalCode(String postalCode) {
        this.postalCode = postalCode;
    }

    public Boolean getCctvPresent() {
        return cctvPresent;
    }

    public void setCctvPresent(Boolean cctvPresent) {
        this.cctvPresent = cctvPresent;
    }

    public Boolean getSecurityGuard() {
        return securityGuard;
    }

    public void setSecurityGuard(Boolean securityGuard) {
        this.securityGuard = securityGuard;
    }

    public Boolean getBiometricAccess() {
        return biometricAccess;
    }

    public void setBiometricAccess(Boolean biometricAccess) {
        this.biometricAccess = biometricAccess;
    }

    public String getCurfewTime() {
        return curfewTime;
    }

    public void setCurfewTime(String curfewTime) {
        this.curfewTime = curfewTime;
    }

    public String getVerificationStatus() {
        return verificationStatus;
    }

    public void setVerificationStatus(String verificationStatus) {
        this.verificationStatus = verificationStatus;
    }

    public Integer getSafetyScore() {
        return safetyScore;
    }

    public void setSafetyScore(Integer safetyScore) {
        this.safetyScore = safetyScore;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public OffsetDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(OffsetDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
