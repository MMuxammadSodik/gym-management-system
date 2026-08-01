package com.example.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubscriptionPlanResponse {

    private UUID id;

    private String name;

    private Integer durationMonths;

    private Boolean singleSession;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

}