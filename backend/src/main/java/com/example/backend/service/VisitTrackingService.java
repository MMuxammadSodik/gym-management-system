package com.example.backend.service;

import com.example.backend.Entity.Member;
import com.example.backend.Entity.SubscriptionOptionType;
import com.example.backend.Entity.VisitTracking;
import com.example.backend.Repository.MemberRepository;
import com.example.backend.Repository.VisitTrackingRepository;
import com.example.backend.dto.MemberVisitStatsResponse;
import com.example.backend.dto.VisitTrackingRequest;
import com.example.backend.dto.VisitTrackingResponse;
import com.example.backend.mapper.VisitTrackingMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
public class VisitTrackingService {

    @Autowired
    private VisitTrackingRepository visitTrackingRepository;

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private VisitTrackingMapper visitTrackingMapper;

    public List<VisitTrackingResponse> getVisitsByMemberId(UUID memberId) {
        List<VisitTracking> visits = visitTrackingRepository.findByMemberIdOrderByVisitDateDesc(memberId);
        return visits.stream()
                .map(visitTrackingMapper::toResponse)
                .toList();
    }

    public VisitTrackingResponse addVisit(UUID memberId, VisitTrackingRequest request) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("Member not found"));

        LocalDate visitDate = request.getVisitDate() != null ? request.getVisitDate() : LocalDate.now();

        // Check if member has a subscription plan option
        if (member.getSubscriptionPlanOption() == null) {
            throw new RuntimeException("Member does not have a subscription plan option");
        }

        SubscriptionOptionType optionType = member.getSubscriptionPlanOption().getOptionType();

        // For EVERY_DAY option: check if already visited today
        if (optionType == SubscriptionOptionType.EVERY_DAY) {
            boolean alreadyVisited = visitTrackingRepository.existsByMemberIdAndVisitDate(memberId, visitDate);
            if (alreadyVisited) {
                throw new RuntimeException("Member already visited today");
            }

            // Check if subscription is still valid
            if (member.getSubscriptionEndDate() != null && visitDate.isAfter(member.getSubscriptionEndDate())) {
                throw new RuntimeException("Member's subscription has expired");
            }
        }

        // For SKIP_DAY option: check monthly visit limit
        if (optionType == SubscriptionOptionType.SKIP_DAY) {
            LocalDate startOfMonth = visitDate.withDayOfMonth(1);
            LocalDate endOfMonth = visitDate.withDayOfMonth(visitDate.lengthOfMonth());
            
            long visitsThisMonth = visitTrackingRepository.countVisitsInMonth(memberId, startOfMonth, endOfMonth);
            
            if (visitsThisMonth >= 12) {
                throw new RuntimeException("Member has reached the monthly visit limit (12 visits)");
            }
        }

        VisitTracking visitTracking = visitTrackingMapper.toEntity(request);
        visitTracking.setMember(member);
        visitTracking.setVisitDate(visitDate);
        
        VisitTracking saved = visitTrackingRepository.save(visitTracking);
        return visitTrackingMapper.toResponse(saved);
    }

    public MemberVisitStatsResponse getMemberVisitStats(UUID memberId) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("Member not found"));

        if (member.getSubscriptionPlanOption() == null) {
            throw new RuntimeException("Member does not have a subscription plan option");
        }

        SubscriptionOptionType optionType = member.getSubscriptionPlanOption().getOptionType();
        LocalDate today = LocalDate.now();
        
        long totalVisits = visitTrackingRepository.findByMemberIdOrderByVisitDateDesc(memberId).size();
        
        LocalDate startOfMonth = today.withDayOfMonth(1);
        LocalDate endOfMonth = today.withDayOfMonth(today.lengthOfMonth());
        long visitsThisMonth = visitTrackingRepository.countVisitsInMonth(memberId, startOfMonth, endOfMonth);
        
        long remainingVisits = 0;
        long remainingVisitsThisMonth = 0;
        boolean canVisitToday = false;

        if (optionType == SubscriptionOptionType.EVERY_DAY) {
            // For EVERY_DAY: can visit if not already visited today and subscription is valid
            boolean alreadyVisited = visitTrackingRepository.existsByMemberIdAndVisitDate(memberId, today);
            canVisitToday = !alreadyVisited && 
                (member.getSubscriptionEndDate() == null || !today.isAfter(member.getSubscriptionEndDate()));
            
            // Calculate remaining days in subscription
            if (member.getSubscriptionEndDate() != null && !today.isAfter(member.getSubscriptionEndDate())) {
                long daysRemaining = java.time.temporal.ChronoUnit.DAYS.between(today, member.getSubscriptionEndDate()) + 1;
                // Subtract today's visit if already visited
                remainingVisits = alreadyVisited ? daysRemaining - 1 : daysRemaining;
                // For EVERY_DAY, monthly remaining is days left in current month
                long daysLeftInMonth = java.time.temporal.ChronoUnit.DAYS.between(today, endOfMonth) + 1;
                remainingVisitsThisMonth = alreadyVisited ? daysLeftInMonth - 1 : daysLeftInMonth;
            } else if (member.getSubscriptionEndDate() == null) {
                // If no end date, show unlimited or a large number
                remainingVisits = Long.MAX_VALUE;
                long daysLeftInMonth = java.time.temporal.ChronoUnit.DAYS.between(today, endOfMonth) + 1;
                remainingVisitsThisMonth = alreadyVisited ? daysLeftInMonth - 1 : daysLeftInMonth;
            } else {
                remainingVisits = 0;
                remainingVisitsThisMonth = 0;
            }
        } else if (optionType == SubscriptionOptionType.SKIP_DAY) {
            // For SKIP_DAY: can visit if monthly limit not reached
            remainingVisits = 12 - visitsThisMonth;
            remainingVisitsThisMonth = 12 - visitsThisMonth;
            canVisitToday = remainingVisits > 0;
        }

        MemberVisitStatsResponse stats = new MemberVisitStatsResponse();
        stats.setMemberId(memberId);
        stats.setTotalVisits(totalVisits);
        stats.setVisitsThisMonth(visitsThisMonth);
        stats.setRemainingVisits(remainingVisits);
        stats.setRemainingVisitsThisMonth(remainingVisitsThisMonth);
        stats.setCanVisitToday(canVisitToday);
        stats.setOptionType(optionType.name());
        
        return stats;
    }

    public void deleteVisit(UUID visitId) {
        visitTrackingRepository.deleteById(visitId);
    }
}
