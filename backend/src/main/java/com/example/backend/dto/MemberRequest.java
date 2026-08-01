package com.example.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MemberRequest {

    private String firstName;

    private String lastName;

    private String phone;

    private UUID subscriptionPlanId;

    private UUID subscriptionPlanOptionId;

    private Boolean active;

    private Boolean isSinglePurchase;

}
