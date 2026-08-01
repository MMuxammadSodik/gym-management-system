package com.example.backend.mapper;

import com.example.backend.Entity.SubscriptionPlan;
import com.example.backend.Entity.SubscriptionPlanOption;
import com.example.backend.dto.SubscriptionPlanOptionRequest;
import com.example.backend.dto.SubscriptionPlanOptionResponse;
import org.springframework.stereotype.Component;

@Component
public class SubscriptionPlanOptionMapper {

    public SubscriptionPlanOptionResponse toResponse(
            SubscriptionPlanOption option
    ) {

        return SubscriptionPlanOptionResponse.builder()
                .id(option.getId())
                .subscriptionPlanId(option.getSubscriptionPlan().getId())
                .subscriptionPlanName(option.getSubscriptionPlan().getName())
                .durationMonths(option.getSubscriptionPlan().getDurationMonths())
                .optionType(option.getOptionType())
                .price(option.getPrice())
                .build();

    }

    public SubscriptionPlanOption toEntity(
            SubscriptionPlanOptionRequest request,
            SubscriptionPlan subscriptionPlan
    ) {

        return SubscriptionPlanOption.builder()
                .subscriptionPlan(subscriptionPlan)
                .optionType(request.getOptionType())
                .price(request.getPrice())
                .build();

    }

    public void updateEntity(
            SubscriptionPlanOption option,
            SubscriptionPlanOptionRequest request,
            SubscriptionPlan subscriptionPlan
    ) {

        option.setSubscriptionPlan(subscriptionPlan);
        option.setOptionType(request.getOptionType());
        option.setPrice(request.getPrice());

    }

}