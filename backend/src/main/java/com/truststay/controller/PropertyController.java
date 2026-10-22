package com.truststay.controller;

import com.truststay.dto.ApiResponse;
import com.truststay.dto.PropertyRequest;
import com.truststay.dto.PropertyResponse;
import com.truststay.entity.User;
import com.truststay.repository.UserRepository;
import com.truststay.service.PropertyService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/v1/properties")
public class PropertyController {

    private final PropertyService propertyService;
    private final UserRepository userRepository;

    public PropertyController(PropertyService propertyService, UserRepository userRepository) {
        this.propertyService = propertyService;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<PropertyResponse>>> listActiveProperties() {
        List<PropertyResponse> properties = propertyService.getAllActiveProperties();
        return ResponseEntity.ok(ApiResponse.ok("Properties retrieved successfully", properties));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<Page<PropertyResponse>>> searchProperties(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String propertyType,
            @RequestParam(required = false) BigDecimal maxRent,
            @RequestParam(required = false) String genderPreference,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Page<PropertyResponse> results = propertyService.searchProperties(city, propertyType, maxRent, genderPreference, page, size);
        return ResponseEntity.ok(ApiResponse.ok("Properties found", results));
    }

    @GetMapping("/my-properties")
    @PreAuthorize("hasAuthority('ROLE_OWNER') or hasRole('OWNER')")
    public ResponseEntity<ApiResponse<List<PropertyResponse>>> getMyProperties(Authentication authentication) {
        Long ownerId = resolveAuthenticatedUserId(authentication);
        List<PropertyResponse> properties = propertyService.getPropertiesByOwner(ownerId);
        return ResponseEntity.ok(ApiResponse.ok("Owner properties retrieved", properties));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PropertyResponse>> getPropertyById(@PathVariable Long id) {
        PropertyResponse property = propertyService.getPropertyById(id);
        return ResponseEntity.ok(ApiResponse.ok("Property details retrieved", property));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_OWNER') or hasRole('OWNER')")
    public ResponseEntity<ApiResponse<PropertyResponse>> createProperty(
            @Valid @RequestBody PropertyRequest request,
            Authentication authentication
    ) {
        Long ownerId = resolveAuthenticatedUserId(authentication);
        PropertyResponse created = propertyService.createPropertyForOwner(request, ownerId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Property listing created successfully", created));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_OWNER') or hasRole('OWNER')")
    public ResponseEntity<ApiResponse<PropertyResponse>> updateProperty(
            @PathVariable Long id,
            @Valid @RequestBody PropertyRequest request,
            Authentication authentication
    ) {
        Long ownerId = resolveAuthenticatedUserId(authentication);
        PropertyResponse updated = propertyService.updateProperty(id, request, ownerId);
        return ResponseEntity.ok(ApiResponse.ok("Property updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_OWNER') or hasRole('OWNER')")
    public ResponseEntity<ApiResponse<Void>> deleteProperty(
            @PathVariable Long id,
            Authentication authentication
    ) {
        Long ownerId = resolveAuthenticatedUserId(authentication);
        propertyService.deleteProperty(id, ownerId);
        return ResponseEntity.ok(ApiResponse.ok("Property deleted successfully", null));
    }

    private Long resolveAuthenticatedUserId(Authentication authentication) {
        if (authentication == null) {
            throw new AccessDeniedException("User is not authenticated");
        }
        String principal = authentication.getName();
        try {
            return Long.parseLong(principal);
        } catch (NumberFormatException e) {
            // Identifier is email or phone (e.g. from mock user or alternate auth)
            return userRepository.findByEmail(principal)
                    .or(() -> userRepository.findByPhoneNumber(principal))
                    .map(User::getId)
                    .orElse(null);
        }
    }
}
