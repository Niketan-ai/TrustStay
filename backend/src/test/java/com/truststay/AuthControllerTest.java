package com.truststay;

import com.truststay.entity.Role;
import com.truststay.entity.User;
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

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@TestPropertySource(locations = "classpath:application-test.properties")
@Transactional
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @BeforeEach
    void setUp() {
        Role adminRole = roleRepository.findByName("ROLE_ADMIN")
                .orElseGet(() -> roleRepository.save(new Role("ROLE_ADMIN", "Administrator")));
        Role ownerRole = roleRepository.findByName("ROLE_OWNER")
                .orElseGet(() -> roleRepository.save(new Role("ROLE_OWNER", "Property Owner")));
        Role tenantRole = roleRepository.findByName("ROLE_TENANT")
                .orElseGet(() -> roleRepository.save(new Role("ROLE_TENANT", "Tenant")));

        if (!userRepository.existsByEmail("niketan@truststay.demo")) {
            User admin = new User("+000-000-0000", "Niketan", "niketan@truststay.demo");
            admin.setPasswordHash(passwordEncoder.encode("Admin123!"));
            admin.setStatus("ACTIVE");
            admin.getRoles().add(adminRole);
            userRepository.save(admin);
        }

        if (!userRepository.existsByEmail("owner@truststay.demo")) {
            User owner = new User("+111-111-1111", "Owner Demo", "owner@truststay.demo");
            owner.setPasswordHash(passwordEncoder.encode("Owner123!"));
            owner.setStatus("ACTIVE");
            owner.getRoles().add(ownerRole);
            userRepository.save(owner);
        }
    }

    @Test
    void login_WithValidCredentials_ShouldReturnJwtAndRoles() throws Exception {
        String loginPayload = """
            {
                "identifier": "niketan@truststay.demo",
                "password": "Admin123!"
            }
        """;

        mockMvc.perform(post("/api/v1/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(loginPayload))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.token", notNullValue()))
                .andExpect(jsonPath("$.data.user.email", is("niketan@truststay.demo")))
                .andExpect(jsonPath("$.data.user.fullName", is("Niketan")))
                .andExpect(jsonPath("$.data.user.roles", hasItem("ROLE_ADMIN")));
    }

    @Test
    void login_WithInvalidPassword_ShouldReturn400BadRequest() throws Exception {
        String loginPayload = """
            {
                "identifier": "niketan@truststay.demo",
                "password": "WrongPassword999!"
            }
        """;

        mockMvc.perform(post("/api/v1/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(loginPayload))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success", is(false)))
                .andExpect(jsonPath("$.message", containsString("Invalid credentials")));
    }

    @Test
    void signup_WithValidData_ShouldCreateTenantOnly() throws Exception {
        String signupPayload = """
            {
                "fullName": "New Student Tenant",
                "phoneNumber": "+91-9988776655",
                "email": "student@truststay.test",
                "password": "SecretPassword123!"
            }
        """;

        mockMvc.perform(post("/api/v1/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(signupPayload))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.token", notNullValue()))
                .andExpect(jsonPath("$.data.user.email", is("student@truststay.test")))
                .andExpect(jsonPath("$.data.user.roles", contains("ROLE_TENANT")))
                .andExpect(jsonPath("$.data.user.roles", not(hasItem("ROLE_ADMIN"))))
                .andExpect(jsonPath("$.data.user.roles", not(hasItem("ROLE_OWNER"))));
    }

    @Test
    void signup_WithInvalidData_ShouldReturn400ValidationFailed() throws Exception {
        String invalidPayload = """
            {
                "fullName": "",
                "phoneNumber": "invalid-phone",
                "email": "not-an-email",
                "password": "123"
            }
        """;

        mockMvc.perform(post("/api/v1/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(invalidPayload))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success", is(false)))
                .andExpect(jsonPath("$.message", is("Validation failed")))
                .andExpect(jsonPath("$.data.fullName", notNullValue()))
                .andExpect(jsonPath("$.data.password", notNullValue()));
    }
}
