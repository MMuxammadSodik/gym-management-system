package com.example.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;

@Data
@AllArgsConstructor
public class CurrentUserResponse {

    private String username;
    private String firstName;
    private String lastName;
    private String role;

    // getters
}