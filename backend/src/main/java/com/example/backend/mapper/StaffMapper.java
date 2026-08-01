package com.example.backend.mapper;

import com.example.backend.Entity.User;
import com.example.backend.dto.StaffRequest;
import com.example.backend.dto.StaffResponse;
import org.springframework.stereotype.Component;

@Component
public class StaffMapper {

    public StaffResponse toResponse(User user) {

        return StaffResponse.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .username(user.getUsername())
                .role(user.getRole().getName().name())
                .createdAt(user.getCreatedAt())
                .build();

    }

    public void updateEntity(User user, StaffRequest request) {

        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setUsername(request.getUsername());

    }

}
