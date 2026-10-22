package com.truststay;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@TestPropertySource(locations = "classpath:application-test.properties")
class PropertyValidationTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @WithMockUser(username = "test", roles = {"OWNER"})
    void createProperty_WithInvalidData_ShouldReturn400BadRequest() throws Exception {
        // Missing title, negative rent, missing propertyType
        String invalidPayload = """
            {
                "title": "",
                "description": "Short",
                "rentAmount": -500,
                "city": ""
            }
        """;

        mockMvc.perform(post("/api/v1/properties")
                .with(user("testOwner").roles("OWNER"))
                .contentType(MediaType.APPLICATION_JSON)
                .content(invalidPayload))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success", is(false)))
                .andExpect(jsonPath("$.message", is("Validation failed")))
                .andExpect(jsonPath("$.data.title").exists())
                .andExpect(jsonPath("$.data.rentAmount").exists());
    }

    @Test
    void createProperty_Unauthenticated_ShouldReturn401Unauthorized() throws Exception {
        String payload = """
            {
                "title": "Unauthenticated Studio",
                "description": "Should not be allowed",
                "propertyType": "STUDIO",
                "targetTenantType": "ANY",
                "genderPreference": "CO_ED",
                "rentAmount": 10000,
                "depositAmount": 20000,
                "addressLine1": "Main Road",
                "city": "Bengaluru",
                "state": "Karnataka",
                "postalCode": "560001",
                "ownerId": 1
            }
        """;

        mockMvc.perform(post("/api/v1/properties")
                .contentType(MediaType.APPLICATION_JSON)
                .content(payload))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void createProperty_WithTenantRole_ShouldReturn403Forbidden() throws Exception {
        String payload = """
            {
                "title": "Tenant Trying to Create Property",
                "description": "Should be forbidden",
                "propertyType": "STUDIO",
                "targetTenantType": "ANY",
                "genderPreference": "CO_ED",
                "rentAmount": 10000,
                "depositAmount": 20000,
                "addressLine1": "Main Road",
                "city": "Bengaluru",
                "state": "Karnataka",
                "postalCode": "560001",
                "ownerId": 1
            }
        """;

        mockMvc.perform(post("/api/v1/properties")
                .with(user("tenantUser").roles("TENANT"))
                .contentType(MediaType.APPLICATION_JSON)
                .content(payload))
                .andExpect(status().isForbidden());
    }
}
