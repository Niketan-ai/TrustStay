package com.truststay.dto;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

public class PropertyResponse {

    private Long id;
    private String title;
    private String description;
    private String propertyType;
    private String targetTenantType;
    private String genderPreference;
    private BigDecimal rentAmount;
    private BigDecimal depositAmount;
    private String addressLine1;
    private String city;
    private String state;
    private String postalCode;
    private Boolean cctvPresent;
    private Boolean securityGuard;
    private Boolean biometricAccess;
    private String curfewTime;
    private String verificationStatus;
    private Integer safetyScore;
    private Boolean isActive;
    private Long ownerId;
    private String ownerName;
    private OffsetDateTime createdAt;

    public PropertyResponse() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public Long getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(Long ownerId) {
        this.ownerId = ownerId;
    }

    public String getOwnerName() {
        return ownerName;
    }

    public void setOwnerName(String ownerName) {
        this.ownerName = ownerName;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
