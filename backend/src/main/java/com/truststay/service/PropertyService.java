package com.truststay.service;

import com.truststay.dto.PropertyRequest;
import com.truststay.dto.PropertyResponse;
import com.truststay.entity.Property;
import com.truststay.entity.User;
import com.truststay.exception.ResourceNotFoundException;
import com.truststay.repository.PropertyRepository;
import com.truststay.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class PropertyService {

    private final PropertyRepository propertyRepository;
    private final UserRepository userRepository;

    public PropertyService(PropertyRepository propertyRepository, UserRepository userRepository) {
        this.propertyRepository = propertyRepository;
        this.userRepository = userRepository;
    }

    public List<PropertyResponse> getAllActiveProperties() {
        return propertyRepository.findByIsActiveTrue().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public Page<PropertyResponse> searchProperties(String city, String propertyType, BigDecimal maxRent, String genderPreference, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "safetyScore"));
        return propertyRepository.searchProperties(city, propertyType, maxRent, genderPreference, pageable)
                .map(this::toResponse);
    }

    public PropertyResponse getPropertyById(Long id) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Property not found with id: " + id));
        return toResponse(property);
    }

    public List<PropertyResponse> getPropertiesByOwner(Long ownerId) {
        return propertyRepository.findByOwnerId(ownerId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<PropertyResponse> getAllPropertiesForAdmin() {
        return propertyRepository.findAll(Sort.by(Sort.Direction.DESC, "id")).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public PropertyResponse createProperty(PropertyRequest request) {
        return createPropertyForOwner(request, request.getOwnerId());
    }

    @Transactional
    public PropertyResponse createPropertyForOwner(PropertyRequest request, Long ownerId) {
        Long targetOwnerId = ownerId != null ? ownerId : request.getOwnerId();
        if (targetOwnerId == null) {
            throw new ResourceNotFoundException("Owner ID could not be identified.");
        }

        User owner = userRepository.findById(targetOwnerId)
                .orElseThrow(() -> new ResourceNotFoundException("Owner not found with id: " + targetOwnerId));

        Property property = new Property();
        property.setOwner(owner);
        property.setTitle(request.getTitle());
        property.setDescription(request.getDescription());
        property.setPropertyType(request.getPropertyType());
        property.setTargetTenantType(request.getTargetTenantType() != null ? request.getTargetTenantType() : "ANY");
        property.setGenderPreference(request.getGenderPreference() != null ? request.getGenderPreference() : "CO_ED");
        property.setRentAmount(request.getRentAmount());
        property.setDepositAmount(request.getDepositAmount());
        property.setAddressLine1(request.getAddressLine1());
        property.setCity(request.getCity());
        property.setState(request.getState() != null ? request.getState() : "State");
        property.setPostalCode(request.getPostalCode() != null ? request.getPostalCode() : "00000");
        property.setCctvPresent(request.getCctvPresent() != null ? request.getCctvPresent() : false);
        property.setSecurityGuard(request.getSecurityGuard() != null ? request.getSecurityGuard() : false);
        property.setBiometricAccess(request.getBiometricAccess() != null ? request.getBiometricAccess() : false);
        property.setCurfewTime(request.getCurfewTime());

        // Default verification status
        property.setVerificationStatus("UNVERIFIED");
        property.setSafetyScore(calculateInitialScore(property));
        property.setIsActive(true);
        property.setCreatedAt(OffsetDateTime.now());
        property.setUpdatedAt(OffsetDateTime.now());

        Property saved = propertyRepository.save(property);
        return toResponse(saved);
    }

    @Transactional
    public PropertyResponse updateProperty(Long propertyId, PropertyRequest request, Long currentOwnerId) {
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new ResourceNotFoundException("Property not found with id: " + propertyId));

        if (property.getOwner() == null || !property.getOwner().getId().equals(currentOwnerId)) {
            throw new AccessDeniedException("Access denied: You can only modify your own property listings.");
        }

        property.setTitle(request.getTitle());
        property.setDescription(request.getDescription());
        property.setPropertyType(request.getPropertyType());
        if (request.getTargetTenantType() != null) property.setTargetTenantType(request.getTargetTenantType());
        if (request.getGenderPreference() != null) property.setGenderPreference(request.getGenderPreference());
        property.setRentAmount(request.getRentAmount());
        property.setDepositAmount(request.getDepositAmount());
        property.setAddressLine1(request.getAddressLine1());
        property.setCity(request.getCity());
        if (request.getState() != null) property.setState(request.getState());
        if (request.getPostalCode() != null) property.setPostalCode(request.getPostalCode());
        if (request.getCctvPresent() != null) property.setCctvPresent(request.getCctvPresent());
        if (request.getSecurityGuard() != null) property.setSecurityGuard(request.getSecurityGuard());
        if (request.getBiometricAccess() != null) property.setBiometricAccess(request.getBiometricAccess());
        property.setCurfewTime(request.getCurfewTime());
        property.setSafetyScore(calculateInitialScore(property));
        property.setUpdatedAt(OffsetDateTime.now());

        return toResponse(propertyRepository.save(property));
    }

    @Transactional
    public void deleteProperty(Long propertyId, Long currentOwnerId) {
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new ResourceNotFoundException("Property not found with id: " + propertyId));

        if (property.getOwner() == null || !property.getOwner().getId().equals(currentOwnerId)) {
            throw new AccessDeniedException("Access denied: You can only delete your own property listings.");
        }

        propertyRepository.delete(property);
    }

    @Transactional
    public PropertyResponse verifyProperty(Long propertyId) {
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new ResourceNotFoundException("Property not found with id: " + propertyId));

        property.setVerificationStatus("VERIFIED");
        // Verified properties achieve an audit boost up to 100
        int score = property.getSafetyScore() != null ? property.getSafetyScore() : 50;
        property.setSafetyScore(Math.min(score + 10, 100));
        property.setUpdatedAt(OffsetDateTime.now());

        return toResponse(propertyRepository.save(property));
    }

    private int calculateInitialScore(Property property) {
        int score = 50; // Base score
        if (Boolean.TRUE.equals(property.getCctvPresent())) score += 15;
        if (Boolean.TRUE.equals(property.getSecurityGuard())) score += 15;
        if (Boolean.TRUE.equals(property.getBiometricAccess())) score += 10;
        return Math.min(score, 100);
    }

    public PropertyResponse toResponse(Property property) {
        PropertyResponse response = new PropertyResponse();
        response.setId(property.getId());
        response.setTitle(property.getTitle());
        response.setDescription(property.getDescription());
        response.setPropertyType(property.getPropertyType());
        response.setTargetTenantType(property.getTargetTenantType());
        response.setGenderPreference(property.getGenderPreference());
        response.setRentAmount(property.getRentAmount());
        response.setDepositAmount(property.getDepositAmount());
        response.setAddressLine1(property.getAddressLine1());
        response.setCity(property.getCity());
        response.setState(property.getState());
        response.setPostalCode(property.getPostalCode());
        response.setCctvPresent(property.getCctvPresent());
        response.setSecurityGuard(property.getSecurityGuard());
        response.setBiometricAccess(property.getBiometricAccess());
        response.setCurfewTime(property.getCurfewTime());
        response.setVerificationStatus(property.getVerificationStatus());
        response.setSafetyScore(property.getSafetyScore());
        response.setIsActive(property.getIsActive());
        response.setCreatedAt(property.getCreatedAt());

        if (property.getOwner() != null) {
            response.setOwnerId(property.getOwner().getId());
            response.setOwnerName(property.getOwner().getFullName());
        }
        return response;
    }
}
