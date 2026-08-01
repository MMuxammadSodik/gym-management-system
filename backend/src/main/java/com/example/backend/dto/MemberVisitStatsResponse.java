package com.example.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MemberVisitStatsResponse {
    private UUID memberId;
    private long totalVisits;
    private long visitsThisMonth;
    private long remainingVisits;
    private long remainingVisitsThisMonth;
    private boolean canVisitToday;
    private String optionType;
}
