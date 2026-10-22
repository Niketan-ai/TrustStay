package com.truststay.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;

public class PropertyRequest {

    @NotBlank(message = "Title is mandatory")
    @Size(min = 5, max = 200, message = "Title must be between 5 and 200 characters")
    private String title;

    @NotBlank(message = "Description is mandatory")
    @Size(min = 10, max = 3000, message = "Description must be between 10 and 3000 characters")
    private String description;

    @NotBlank(message = "Property type is mandatory (APARTMENT, HOSTEL, PG_CO_LIVING, STUDIO)")
    private String propertyType;

    @NotBlank(message = "Target tenant type is mandatory (STUDENTS_ONLY, PROFESSIONALS_ONLY, ANY)")
    private String targetTenantType;

    @NotBlank(message = "Gender preference is mandatory (FEMALE_ONLY, MALE_ONLY, CO_ED)")
    private String genderPreference;

    @NotNull(message = "Rent amount is mandatory")
    @Positive(message = "Rent amount must be greater than zero")
    private BigDecimal rentAmount;

    @NotNull(message = "Deposit amount is mandatory")
    @PositiveOrZero(message = "Deposit amount cannot be negative")
    private BigDecimal depositAmount;

    @NotBlank(message = "Address line is mandatory")
    private String addressLine1;

    @NotBlank(message = "City is mandatory")
    private String city;

    @NotBlank(message = "State is mandatory")
    private String state;

    @NotBlank(message = "Postal code is mandatory")
    private String postalCode;

    private Boolean cctvPresent = false;
    private Boolean securityGuard = false;
    private Boolean biometricAccess = false;
    private String curfewTime;

    private Long ownerId;

    public PropertyRequest() {}

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

    public Long getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(Long ownerId) {
        this.ownerId = ownerId;
    }
}
