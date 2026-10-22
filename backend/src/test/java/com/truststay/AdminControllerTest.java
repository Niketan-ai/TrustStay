package com.truststay;

import com.truststay.entity.Property;
import com.truststay.entity.Role;
import com.truststay.entity.User;
import com.truststay.repository.PropertyRepository;
import com.truststay.repository.RoleRepository;
import com.truststay.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

import static org.hamcrest.Matchers.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@TestPropertySource(locations = "classpath:application-test.properties")
@Transactional
class AdminControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PropertyRepository propertyRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private Property sampleProperty;

    @BeforeEach
    void setUp() {
        Role adminRole = roleRepository.findByName("ROLE_ADMIN")
                .orElseGet(() -> roleRepository.save(new Role("ROLE_ADMIN", "Administrator")));
        Role ownerRole = roleRepository.findByName("ROLE_OWNER")
                .orElseGet(() -> roleRepository.save(new Role("ROLE_OWNER", "Property Owner")));

        User admin = new User("+000-000-0000", "Niketan", "niketan@truststay.demo");
        admin.setPasswordHash(passwordEncoder.encode("Admin123!"));
        admin.getRoles().add(adminRole);
        userRepository.save(admin);

        User owner = new User("+111-111-1111", "Owner Demo", "owner@truststay.demo");
        owner.setPasswordHash(passwordEncoder.encode("Owner123!"));
        owner.getRoles().add(ownerRole);
        owner = userRepository.save(owner);

        sampleProperty = new Property();
        sampleProperty.setOwner(owner);
        sampleProperty.setTitle("Sample Admin Verification Property");
        sampleProperty.setDescription("Description for admin audit test");
        sampleProperty.setPropertyType("STUDIO");
        sampleProperty.setTargetTenantType("ANY");
        sampleProperty.setGenderPreference("CO_ED");
        sampleProperty.setRentAmount(new BigDecimal("12000.00"));
        sampleProperty.setDepositAmount(new BigDecimal("24000.00"));
        sampleProperty.setAddressLine1("Street 1");
        sampleProperty.setCity("Bengaluru");
        sampleProperty.setState("Karnataka");
        sampleProperty.setPostalCode("560001");
        sampleProperty.setVerificationStatus("UNVERIFIED");
        sampleProperty.setSafetyScore(60);
        sampleProperty.setIsActive(true);
        sampleProperty.setCreatedAt(OffsetDateTime.now());
        sampleProperty.setUpdatedAt(OffsetDateTime.now());
        sampleProperty = propertyRepository.save(sampleProperty);
    }

    @Test
    void adminEndpoints_WithoutAuthentication_ShouldReturn401() throws Exception {
        mockMvc.perform(get("/api/v1/admin/stats"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void adminEndpoints_WithTenantRole_ShouldReturn403Forbidden() throws Exception {
        mockMvc.perform(get("/api/v1/admin/stats")
                .with(user("tenantUser").roles("TENANT")))
                .andExpect(status().isForbidden());
    }

    @Test
    void adminEndpoints_WithOwnerRole_ShouldReturn403Forbidden() throws Exception {
        mockMvc.perform(get("/api/v1/admin/stats")
                .with(user("ownerUser").roles("OWNER")))
                .andExpect(status().isForbidden());
    }

    @Test
    void adminEndpoints_WithAdminRole_ShouldReturnStatsAndUsers() throws Exception {
        mockMvc.perform(get("/api/v1/admin/stats")
                .with(user("adminUser").roles("ADMIN")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.totalUsers", greaterThanOrEqualTo(2)))
                .andExpect(jsonPath("$.data.totalProperties", greaterThanOrEqualTo(1)));

        mockMvc.perform(get("/api/v1/admin/users")
                .with(user("adminUser").roles("ADMIN")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data", not(empty())));
    }

    @Test
    void adminVerifyProperty_ShouldUpdateVerificationStatusToVerified() throws Exception {
        mockMvc.perform(patch("/api/v1/admin/properties/" + sampleProperty.getId() + "/verify")
                .with(user("adminUser").roles("ADMIN")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.verificationStatus", is("VERIFIED")))
                .andExpect(jsonPath("$.data.safetyScore", is(70)));
    }
}
