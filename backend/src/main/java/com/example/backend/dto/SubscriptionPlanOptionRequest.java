package com.example.backend.dto;

import com.example.backend.Entity.SubscriptionOptionType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubscriptionPlanOptionRequest {

    private UUID subscriptionPlanId;

    private SubscriptionOptionType optionType;

    private BigDecimal price;

}