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
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

import static org.hamcrest.Matchers.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@TestPropertySource(locations = "classpath:application-test.properties")
@Transactional
class PropertySecurityTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PropertyRepository propertyRepository;

    private User ownerA;
    private User ownerB;
    private Property propertyA;

    @BeforeEach
    void setUp() {
        Role ownerRole = roleRepository.findByName("ROLE_OWNER")
                .orElseGet(() -> roleRepository.save(new Role("ROLE_OWNER", "Property Host")));

        ownerA = new User("+111-000-0001", "Owner A", "ownerA@truststay.test");
        ownerA.getRoles().add(ownerRole);
        ownerA = userRepository.save(ownerA);

        ownerB = new User("+111-000-0002", "Owner B", "ownerB@truststay.test");
        ownerB.getRoles().add(ownerRole);
        ownerB = userRepository.save(ownerB);

        propertyA = new Property();
        propertyA.setOwner(ownerA);
        propertyA.setTitle("Owner A Luxury Flat");
        propertyA.setDescription("Spacious accommodation owned by Owner A");
        propertyA.setPropertyType("APARTMENT");
        propertyA.setTargetTenantType("ANY");
        propertyA.setGenderPreference("CO_ED");
        propertyA.setRentAmount(new BigDecimal("22000.00"));
        propertyA.setDepositAmount(new BigDecimal("44000.00"));
        propertyA.setAddressLine1("42 Residency Road");
        propertyA.setCity("Bengaluru");
        propertyA.setState("Karnataka");
        propertyA.setPostalCode("560025");
        propertyA.setVerificationStatus("UNVERIFIED");
        propertyA.setSafetyScore(70);
        propertyA.setIsActive(true);
        propertyA.setCreatedAt(OffsetDateTime.now());
        propertyA.setUpdatedAt(OffsetDateTime.now());
        propertyA = propertyRepository.save(propertyA);
    }

    @Test
    void createProperty_ByAuthorizedOwner_ShouldSucceed() throws Exception {
        String validPayload = """
            {
                "title": "Brand New Verified Suite",
                "description": "Safe verified home with CCTV and biometric lock",
                "propertyType": "STUDIO",
                "targetTenantType": "STUDENTS_ONLY",
                "genderPreference": "CO_ED",
                "rentAmount": 16000,
                "depositAmount": 30000,
                "addressLine1": "100 Outer Ring Road",
                "city": "Bengaluru",
                "state": "Karnataka",
                "postalCode": "560103",
                "cctvPresent": true,
                "securityGuard": true,
                "biometricAccess": true
            }
        """;

        mockMvc.perform(post("/api/v1/properties")
                .with(user(String.valueOf(ownerA.getId())).roles("OWNER"))
                .contentType(MediaType.APPLICATION_JSON)
                .content(validPayload))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.id", notNullValue()))
                .andExpect(jsonPath("$.data.title", is("Brand New Verified Suite")))
                .andExpect(jsonPath("$.data.ownerId", is(ownerA.getId().intValue())));
    }

    @Test
    void updateProperty_ByDifferentOwner_ShouldReturn403Forbidden() throws Exception {
        String updatePayload = """
            {
                "title": "Malicious Modification Attempt",
                "description": "Should be rejected because ownerB does not own propertyA",
                "propertyType": "APARTMENT",
                "targetTenantType": "ANY",
                "genderPreference": "CO_ED",
                "rentAmount": 25000,
                "depositAmount": 50000,
                "addressLine1": "Hacked Address",
                "city": "Bengaluru",
                "state": "Karnataka",
                "postalCode": "560001"
            }
        """;

        mockMvc.perform(put("/api/v1/properties/" + propertyA.getId())
                .with(user(String.valueOf(ownerB.getId())).roles("OWNER"))
                .contentType(MediaType.APPLICATION_JSON)
                .content(updatePayload))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.success", is(false)))
                .andExpect(jsonPath("$.message", containsString("Access denied")));
    }

    @Test
    void deleteProperty_ByDifferentOwner_ShouldReturn403Forbidden() throws Exception {
        mockMvc.perform(delete("/api/v1/properties/" + propertyA.getId())
                .with(user(String.valueOf(ownerB.getId())).roles("OWNER")))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.success", is(false)))
                .andExpect(jsonPath("$.message", containsString("Access denied")));
    }

    @Test
    void getMyProperties_ShouldReturnOnlyAuthenticatedOwnerProperties() throws Exception {
        mockMvc.perform(get("/api/v1/properties/my-properties")
                .with(user(String.valueOf(ownerA.getId())).roles("OWNER")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data", hasSize(1)))
                .andExpect(jsonPath("$.data[0].id", is(propertyA.getId().intValue())));

        mockMvc.perform(get("/api/v1/properties/my-properties")
                .with(user(String.valueOf(ownerB.getId())).roles("OWNER")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data", empty()));
    }
}
