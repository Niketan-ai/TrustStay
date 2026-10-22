package com.truststay.service;

import com.truststay.dto.AuthResponse;
import com.truststay.dto.LoginRequest;
import com.truststay.dto.SignupRequest;
import com.truststay.dto.UserResponse;
import com.truststay.entity.Role;
import com.truststay.entity.User;
import com.truststay.exception.BadRequestException;
import com.truststay.repository.RoleRepository;
import com.truststay.repository.UserRepository;
import com.truststay.security.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final UserService userService;

    public AuthService(
            UserRepository userRepository,
            RoleRepository roleRepository,
            PasswordEncoder passwordEncoder,
            JwtUtil jwtUtil,
            UserService userService
    ) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.userService = userService;
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        String identifier = request.getIdentifier().trim();
        Optional<User> userOpt = identifier.contains("@")
                ? userRepository.findByEmail(identifier)
                : userRepository.findByPhoneNumber(identifier);

        if (userOpt.isEmpty()) {
            // Also try phone number fallback if email didn't match
            userOpt = userRepository.findByPhoneNumber(identifier);
        }

        if (userOpt.isEmpty()) {
            throw new BadRequestException("Invalid credentials. Please verify your email/phone and password.");
        }

        User user = userOpt.get();

        if (user.getPasswordHash() == null || !passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new BadRequestException("Invalid credentials. Please verify your email/phone and password.");
        }

        List<String> roles = user.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.toList());

        String token = jwtUtil.generateToken(user.getId(), user.getEmail() != null ? user.getEmail() : user.getPhoneNumber(), roles);
        UserResponse userResponse = userService.toResponse(user);

        return new AuthResponse(token, userResponse);
    }

    @Transactional
    public AuthResponse signup(SignupRequest request) {
        String phone = request.getPhoneNumber().trim();
        String email = request.getEmail() != null && !request.getEmail().isBlank()
                ? request.getEmail().trim().toLowerCase()
                : null;

        if (userRepository.existsByPhoneNumber(phone)) {
            throw new BadRequestException("A user with this phone number already exists.");
        }

        if (email != null && userRepository.existsByEmail(email)) {
            throw new BadRequestException("A user with this email address already exists.");
        }

        User user = new User(phone, request.getFullName().trim(), email);
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setStatus("ACTIVE");
        user.setIsPhoneVerified(false);
        user.setIsIdentityVerified(false);

        // Security requirement: public signup MUST ALWAYS assign ROLE_TENANT only!
        Role tenantRole = roleRepository.findByName("ROLE_TENANT")
                .orElseGet(() -> roleRepository.save(new Role("ROLE_TENANT", "Default Tenant Role")));
        user.getRoles().add(tenantRole);

        User savedUser = userRepository.save(user);

        List<String> roles = List.of(tenantRole.getName());
        String token = jwtUtil.generateToken(savedUser.getId(), email != null ? email : phone, roles);
        UserResponse userResponse = userService.toResponse(savedUser);

        return new AuthResponse(token, userResponse);
    }
}
