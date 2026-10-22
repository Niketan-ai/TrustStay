package com.truststay.service;

import com.truststay.dto.UserResponse;
import com.truststay.entity.Role;
import com.truststay.entity.User;
import com.truststay.exception.ResourceNotFoundException;
import com.truststay.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        return toResponse(user);
    }

    public UserResponse getUserByPhoneNumber(String phoneNumber) {
        User user = userRepository.findByPhoneNumber(phoneNumber)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with phone: " + phoneNumber));
        return toResponse(user);
    }

    public UserResponse toResponse(User user) {
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setPhoneNumber(user.getPhoneNumber());
        response.setEmail(user.getEmail());
        response.setFullName(user.getFullName());
        response.setIsPhoneVerified(user.getIsPhoneVerified());
        response.setIsIdentityVerified(user.getIsIdentityVerified());
        response.setStatus(user.getStatus());
        response.setCreatedAt(user.getCreatedAt());
        response.setRoles(user.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.toSet()));
        return response;
    }
}
