package com.truststay;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;

@SpringBootTest
@ActiveProfiles("test")
@TestPropertySource(locations = "classpath:application-test.properties")
class TrustStayApplicationTests {

    @Test
    void contextLoads() {
        // Confirms Spring Boot application context bootstraps successfully
    }
}
