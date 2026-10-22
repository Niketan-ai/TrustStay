package com.truststay.controller;

import com.truststay.dto.AdminStatsResponse;
import com.truststay.dto.ApiResponse;
import com.truststay.dto.PropertyResponse;
import com.truststay.dto.UserResponse;
import com.truststay.entity.Property;
import com.truststay.entity.User;
import com.truststay.exception.ResourceNotFoundException;
import com.truststay.repository.PropertyRepository;
import com.truststay.repository.UserRepository;
import com.truststay.service.PropertyService;
import com.truststay.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/admin")
@PreAuthorize("hasAuthority('ROLE_ADMIN') or hasRole('ADMIN')")
public class AdminController {

    private final UserRepository userRepository;
    private final PropertyRepository propertyRepository;
    private final UserService userService;
    private final PropertyService propertyService;

    public AdminController(
            UserRepository userRepository,
            PropertyRepository propertyRepository,
            UserService userService,
            PropertyService propertyService
    ) {
        this.userRepository = userRepository;
        this.propertyRepository = propertyRepository;
        this.userService = userService;
        this.propertyService = propertyService;
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<AdminStatsResponse>> getPlatformStats() {
        long totalUsers = userRepository.count();
        List<Property> allProps = propertyRepository.findAll();
        long totalProperties = allProps.size();
        long verifiedProperties = allProps.stream()
                .filter(p -> "VERIFIED".equalsIgnoreCase(p.getVerificationStatus()))
                .count();
        long unverifiedProperties = totalProperties - verifiedProperties;

        AdminStatsResponse stats = new AdminStatsResponse(totalUsers, totalProperties, verifiedProperties, unverifiedProperties);
        return ResponseEntity.ok(ApiResponse.ok("Platform statistics retrieved", stats));
    }

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<UserResponse>>> getAllUsers() {
        List<UserResponse> users = userRepository.findAll().stream()
                .map(userService::toResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.ok("Users retrieved successfully", users));
    }

    @GetMapping("/properties")
    public ResponseEntity<ApiResponse<List<PropertyResponse>>> getAllProperties() {
        List<PropertyResponse> properties = propertyService.getAllPropertiesForAdmin();
        return ResponseEntity.ok(ApiResponse.ok("All properties retrieved for administrative audit", properties));
    }

    @PatchMapping("/properties/{id}/verify")
    public ResponseEntity<ApiResponse<PropertyResponse>> verifyProperty(@PathVariable Long id) {
        PropertyResponse verified = propertyService.verifyProperty(id);
        return ResponseEntity.ok(ApiResponse.ok("Property successfully verified and safety score updated", verified));
    }

    @PatchMapping("/users/{id}/status")
    public ResponseEntity<ApiResponse<UserResponse>> toggleUserStatus(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        String newStatus = "ACTIVE".equalsIgnoreCase(user.getStatus()) ? "SUSPENDED" : "ACTIVE";
        user.setStatus(newStatus);
        user.setUpdatedAt(OffsetDateTime.now());
        User updated = userRepository.save(user);

        return ResponseEntity.ok(ApiResponse.ok("User status updated to " + newStatus, userService.toResponse(updated)));
    }
}
