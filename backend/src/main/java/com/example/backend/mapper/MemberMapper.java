package com.example.backend.mapper;

import com.example.backend.Entity.Member;
import com.example.backend.Entity.SubscriptionOptionType;
import com.example.backend.Entity.SubscriptionPlan;
import com.example.backend.Entity.SubscriptionPlanOption;
import com.example.backend.dto.MemberRequest;
import com.example.backend.dto.MemberResponse;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class MemberMapper {

    private String formatOptionType(SubscriptionOptionType type) {
        if (type == null) return null;
        return type.name().replace("_", " ");
    }

    public MemberResponse toResponse(Member member) {

        SubscriptionPlan plan = member.getSubscriptionPlan();
        SubscriptionPlanOption option = member.getSubscriptionPlanOption();

        LocalDate startDate = member.getSubscriptionStartDate();
        LocalDate endDate = member.getSubscriptionEndDate();

        if (startDate == null && member.getCreatedAt() != null) {
            startDate = member.getCreatedAt().toLocalDate();
        }

        if (endDate == null && startDate != null && plan != null) {
            endDate = startDate.plusMonths(plan.getDurationMonths());
        }

        return MemberResponse.builder()
                .id(member.getId())
                .firstName(member.getFirstName())
                .lastName(member.getLastName())
                .phone(member.getPhone())
                .subscriptionPlanId(plan != null ? plan.getId() : null)
                .subscriptionPlanName(plan != null ? plan.getName() : null)
                .subscriptionPlanDurationMonths(plan != null ? plan.getDurationMonths() : null)
                .subscriptionPlanOptionId(option != null ? option.getId() : null)
                .subscriptionPlanOptionType(option != null ? option.getOptionType().name() : null)
                .subscriptionPlanOptionName(option != null ? formatOptionType(option.getOptionType()) : null)
                .subscriptionPlanOptionPrice(option != null ? option.getPrice() : null)
                .subscriptionStartDate(startDate)
                .subscriptionEndDate(endDate)
                .active(member.getActive())
                .createdAt(member.getCreatedAt())
                .updatedAt(member.getUpdatedAt())
                .build();

    }

    public void updateEntity(Member member, MemberRequest request, SubscriptionPlan plan, SubscriptionPlanOption option) {

        member.setFirstName(request.getFirstName());
        member.setLastName(request.getLastName());
        member.setPhone(request.getPhone());
        member.setSubscriptionPlan(plan);
        member.setSubscriptionPlanOption(option);

        if (request.getActive() != null) {
            member.setActive(request.getActive());
        }

    }

}
