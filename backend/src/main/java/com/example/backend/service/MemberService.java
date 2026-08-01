package com.example.backend.service;

import com.example.backend.Entity.Member;
import com.example.backend.Entity.SubscriptionPlan;
import com.example.backend.Entity.SubscriptionPlanOption;
import com.example.backend.Repository.MemberRepository;
import com.example.backend.Repository.SubscriptionPlanOptionRepository;
import com.example.backend.Repository.SubscriptionPlanRepository;
import com.example.backend.dto.MemberRequest;
import com.example.backend.dto.MemberResponse;
import com.example.backend.mapper.MemberMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository memberRepository;
    private final SubscriptionPlanRepository subscriptionPlanRepository;
    private final SubscriptionPlanOptionRepository subscriptionPlanOptionRepository;
    private final MemberMapper memberMapper;

    public List<MemberResponse> getAll() {

        return memberRepository.findAll()
                .stream()
                .map(memberMapper::toResponse)
                .toList();

    }

    public MemberResponse getById(UUID id) {

        Member member = findMember(id);

        return memberMapper.toResponse(member);

    }

    public MemberResponse create(MemberRequest request) {

        Boolean isSinglePurchase = request.getIsSinglePurchase() != null ? request.getIsSinglePurchase() : false;
        SubscriptionPlan plan = findPlan(request.getSubscriptionPlanId(), isSinglePurchase);
        SubscriptionPlanOption option = null;

        if (request.getSubscriptionPlanOptionId() != null) {
            option = findPlanOption(request.getSubscriptionPlanOptionId());
        }

        LocalDate startDate = LocalDate.now();
        LocalDate endDate = plan != null ? startDate.plusMonths(plan.getDurationMonths()) : null;

        Boolean active = request.getActive() != null ? request.getActive() : true;
        if (plan != null && plan.getSingleSession()) {
            active = null;
        }
        if (isSinglePurchase) {
            active = null;
        }

        Member member = Member.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .phone(request.getPhone())
                .subscriptionStartDate(startDate)
                .subscriptionEndDate(endDate)
                .subscriptionPlan(plan)
                .subscriptionPlanOption(option)
                .active(active)
                .build();

        Member savedMember = memberRepository.save(member);

        return memberMapper.toResponse(savedMember);

    }

    public MemberResponse update(UUID id, MemberRequest request) {

        Member member = findMember(id);
        Boolean isSinglePurchase = request.getIsSinglePurchase() != null ? request.getIsSinglePurchase() : false;
        SubscriptionPlan plan = findPlan(request.getSubscriptionPlanId(), isSinglePurchase);
        SubscriptionPlanOption option = null;

        if (request.getSubscriptionPlanOptionId() != null) {
            option = findPlanOption(request.getSubscriptionPlanOptionId());
        }

        UUID previousPlanId = member.getSubscriptionPlan() != null ? member.getSubscriptionPlan().getId() : null;

        memberMapper.updateEntity(member, request, plan, option);

        // Handle active field for single session plans
        if (plan != null && plan.getSingleSession()) {
            member.setActive(null);
        } else if (isSinglePurchase) {
            member.setActive(null);
        } else if (request.getActive() != null) {
            member.setActive(request.getActive());
        }

        if (plan != null && previousPlanId != null && !previousPlanId.equals(plan.getId())) {
            LocalDate startDate = member.getSubscriptionStartDate();

            if (startDate == null) {
                startDate = LocalDate.now();
                member.setSubscriptionStartDate(startDate);
            }

            member.setSubscriptionEndDate(startDate.plusMonths(plan.getDurationMonths()));
        }

        Member updatedMember = memberRepository.save(member);

        return memberMapper.toResponse(updatedMember);

    }

    @Transactional
    public void delete(UUID id) {

        Member member = findMember(id);

        memberRepository.delete(member);

    }

    private Member findMember(UUID id) {

        return memberRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Member not found"));

    }

    private SubscriptionPlan findPlan(UUID planId) {

        if (planId == null) {
            throw new IllegalArgumentException("Subscription plan is required.");
        }

        return subscriptionPlanRepository.findById(planId)
                .orElseThrow(() -> new RuntimeException("Subscription plan not found"));

    }

    private SubscriptionPlan findPlan(UUID planId, Boolean allowSingleSession) {

        if (planId == null && !allowSingleSession) {
            throw new IllegalArgumentException("Subscription plan is required.");
        }

        if (planId == null) {
            return null;
        }

        return subscriptionPlanRepository.findById(planId)
                .orElseThrow(() -> new RuntimeException("Subscription plan not found"));

    }

    private SubscriptionPlanOption findPlanOption(UUID optionId) {
        return subscriptionPlanOptionRepository.findById(optionId)
                .orElseThrow(() -> new RuntimeException("Subscription plan option not found"));
    }

    public List<MemberResponse> getMembersCreatedToday() {
        LocalDate today = LocalDate.now();
        LocalDateTime startOfDay = today.atStartOfDay();
        LocalDateTime endOfDay = today.plusDays(1).atStartOfDay();

        return memberRepository.findByCreatedAtBetween(startOfDay, endOfDay)
                .stream()
                .map(memberMapper::toResponse)
                .toList();
    }

}
