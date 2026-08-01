package com.example.backend.mapper;

import com.example.backend.Entity.SubscriptionPlan;
import com.example.backend.dto.SubscriptionPlanRequest;
import com.example.backend.dto.SubscriptionPlanResponse;
import org.springframework.stereotype.Component;

@Component
public class SubscriptionPlanMapper {

    public SubscriptionPlanResponse toResponse(SubscriptionPlan plan) {

        return SubscriptionPlanResponse.builder()
                .id(plan.getId())
                .name(plan.getName())
                .durationMonths(plan.getDurationMonths())
                .singleSession(plan.getSingleSession())
                .createdAt(plan.getCreatedAt())
                .updatedAt(plan.getUpdatedAt())
                .build();

    }

    public SubscriptionPlan toEntity(SubscriptionPlanRequest request) {

        return SubscriptionPlan.builder()
                .name(request.getName())
                .durationMonths(request.getDurationMonths())
                .singleSession(request.getSingleSession() != null
                        ? request.getSingleSession()
                        : false)
                .build();

    }

    public void updateEntity(SubscriptionPlan plan,
                             SubscriptionPlanRequest request) {

        plan.setName(request.getName());
        plan.setDurationMonths(request.getDurationMonths());

        if (request.getSingleSession() != null) {
            plan.setSingleSession(request.getSingleSession());
        }

    }

}