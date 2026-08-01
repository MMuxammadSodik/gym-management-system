package com.example.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MemberResponse {

    private UUID id;

    private String firstName;

    private String lastName;

    private String phone;

    private UUID subscriptionPlanId;

    private String subscriptionPlanName;

    private Integer subscriptionPlanDurationMonths;

    private UUID subscriptionPlanOptionId;

    private String subscriptionPlanOptionType;

    private String subscriptionPlanOptionName;

    private java.math.BigDecimal subscriptionPlanOptionPrice;

    private LocalDate subscriptionStartDate;

    private LocalDate subscriptionEndDate;

    private Boolean active;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

}
