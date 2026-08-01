package com.example.backend.dto;

import com.example.backend.Entity.SubscriptionOptionType;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@Builder
public class SubscriptionPlanOptionResponse {

    private UUID id;

    private UUID subscriptionPlanId;

    private String subscriptionPlanName;

    private Integer durationMonths;

    private SubscriptionOptionType optionType;

    private BigDecimal price;

}