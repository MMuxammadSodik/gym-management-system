package com.example.backend.service;

import com.example.backend.Entity.Role;
import com.example.backend.Entity.RoleName;
import com.example.backend.Entity.User;
import com.example.backend.Repository.RoleRepository;
import com.example.backend.Repository.UserRepository;
import com.example.backend.dto.StaffRequest;
import com.example.backend.dto.StaffResponse;
import com.example.backend.mapper.StaffMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class StaffService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final StaffMapper staffMapper;
    private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    public List<StaffResponse> getAll() {

        return userRepository.findByRole_Name(RoleName.STAFF)
                .stream()
                .map(staffMapper::toResponse)
                .toList();

    }

    public StaffResponse getById(UUID id) {

        User user = findStaffUser(id);

        return staffMapper.toResponse(user);

    }

    public StaffResponse create(StaffRequest request) {

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Username already exists.");
        }

        Role staffRole = roleRepository.findByName(RoleName.STAFF)
                .orElseThrow(() -> new NoSuchElementException("Staff role not found."));

        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(staffRole)
                .build();

        User savedUser = userRepository.save(user);

        return staffMapper.toResponse(savedUser);

    }

    public StaffResponse update(UUID id, StaffRequest request) {

        User user = findStaffUser(id);

        if (!user.getUsername().equals(request.getUsername())
                && userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Username already exists.");
        }

        staffMapper.updateEntity(user, request);

        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        User updatedUser = userRepository.save(user);

        return staffMapper.toResponse(updatedUser);

    }

    public void delete(UUID id, Authentication authentication) {

        User user = findStaffUser(id);

        if (user.getUsername().equals(authentication.getName())) {
            throw new IllegalArgumentException("You cannot delete your own account.");
        }

        userRepository.delete(user);

    }

    private User findStaffUser(UUID id) {

        return userRepository.findByIdAndRole_Name(id, RoleName.STAFF)
                .orElseThrow(() -> new RuntimeException("Staff member not found"));

    }

}
