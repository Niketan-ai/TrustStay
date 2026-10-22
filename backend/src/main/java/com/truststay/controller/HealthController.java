package com.truststay.controller;

import com.truststay.dto.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/health")
public class HealthController {

    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, String>>> checkHealth() {
        Map<String, String> status = new HashMap<>();
        status.put("status", "UP");
        status.put("service", "TrustStay Backend REST API");
        status.put("environment", "local");
        // Strictly avoid exposing database passwords, JWT secrets, or connection strings
        return ResponseEntity.ok(ApiResponse.ok("Service is healthy", status));
    }
}
