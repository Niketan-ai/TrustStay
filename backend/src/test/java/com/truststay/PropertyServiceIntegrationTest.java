package com.truststay;

import com.truststay.dto.PropertyRequest;
import com.truststay.dto.PropertyResponse;
import com.truststay.entity.Role;
import com.truststay.entity.User;
import com.truststay.repository.RoleRepository;
import com.truststay.repository.UserRepository;
import com.truststay.service.PropertyService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@TestPropertySource(locations = "classpath:application-test.properties")
@Transactional
class PropertyServiceIntegrationTest {

    @Autowired
    private PropertyService propertyService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    private User testOwner;

    @BeforeEach
    void setUp() {
        Role ownerRole = roleRepository.save(new Role("ROLE_OWNER", "Property Host"));
        testOwner = new User("9876543210", "Test Host Owner", "owner@truststay.test");
        testOwner.getRoles().add(ownerRole);
        testOwner.setIsPhoneVerified(true);
        testOwner.setIsIdentityVerified(true);
        testOwner = userRepository.save(testOwner);
    }

    @Test
    void createProperty_AndFetchActive_ShouldSucceed() {
        PropertyRequest req = new PropertyRequest();
        req.setTitle("Verified Student Suite Koramangala");
        req.setDescription("Spacious study room with high-speed wifi and biometric security");
        req.setPropertyType("STUDIO");
        req.setTargetTenantType("STUDENTS_ONLY");
        req.setGenderPreference("CO_ED");
        req.setRentAmount(new BigDecimal("15000.00"));
        req.setDepositAmount(new BigDecimal("25000.00"));
        req.setAddressLine1("Lane 4, Koramangala");
        req.setCity("Bengaluru");
        req.setState("Karnataka");
        req.setPostalCode("560034");
        req.setCctvPresent(true);
        req.setSecurityGuard(true);
        req.setBiometricAccess(true);
        req.setCurfewTime("10:30 PM");
        req.setOwnerId(testOwner.getId());

        PropertyResponse created = propertyService.createProperty(req);

        assertNotNull(created.getId());
        assertEquals("Verified Student Suite Koramangala", created.getTitle());
        assertEquals("UNVERIFIED", created.getVerificationStatus());
        // Score: 50 base + 15 cctv + 15 guard + 10 biometric = 90
        assertEquals(90, created.getSafetyScore());
        assertEquals(testOwner.getId(), created.getOwnerId());

        List<PropertyResponse> activeProperties = propertyService.getAllActiveProperties();
        assertFalse(activeProperties.isEmpty());
        assertTrue(activeProperties.stream().anyMatch(p -> p.getId().equals(created.getId())));
    }
}
