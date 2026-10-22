package com.truststay.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 * Security configuration for the TrustStay backend.
 *
 * - Health check and public property browsing are open to unauthenticated users.
 * - Auth endpoints (/api/v1/auth/**) are publicly accessible.
 * - /api/v1/properties/my-properties requires authentication (ROLE_OWNER).
 * - Property creation, update, and deletion require authentication (ROLE_OWNER).
 * - Administrative endpoints (/api/v1/admin/**) require authentication (ROLE_ADMIN).
 * - Stateless session with JWT filter.
 */
@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // 1. Health check & public auth endpoints
                .requestMatchers(HttpMethod.GET, "/api/v1/health").permitAll()
                .requestMatchers("/api/v1/auth/**").permitAll()

                // 2. Owner-only property management (evaluated before general /api/v1/properties/**)
                .requestMatchers(HttpMethod.GET, "/api/v1/properties/my-properties").authenticated()
                .requestMatchers(HttpMethod.POST, "/api/v1/properties").authenticated()
                .requestMatchers(HttpMethod.PUT, "/api/v1/properties/**").authenticated()
                .requestMatchers(HttpMethod.DELETE, "/api/v1/properties/**").authenticated()

                // 3. Public property listings and search
                .requestMatchers(HttpMethod.GET, "/api/v1/properties").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/v1/properties/search").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/v1/properties/*").permitAll()

                // 4. Admin endpoints
                .requestMatchers("/api/v1/admin/**").authenticated()

                // 5. Fallback for any other endpoint
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
            .httpBasic(Customizer.withDefaults());

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
