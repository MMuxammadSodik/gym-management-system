package com.example.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VisitTrackingResponse {
    private UUID id;
    private UUID memberId;
    private String memberFirstName;
    private String memberLastName;
    private LocalDate visitDate;
    private String notes;
    private LocalDateTime createdAt;
}
