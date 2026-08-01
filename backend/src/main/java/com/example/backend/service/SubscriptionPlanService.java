package com.example.backend.service;

import com.example.backend.Entity.SubscriptionPlan;
import com.example.backend.Repository.SubscriptionPlanRepository;
import com.example.backend.dto.SubscriptionPlanRequest;
import com.example.backend.dto.SubscriptionPlanResponse;
import com.example.backend.mapper.SubscriptionPlanMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SubscriptionPlanService {

    private final SubscriptionPlanRepository subscriptionPlanRepository;
    private final SubscriptionPlanMapper subscriptionPlanMapper;


    public List<SubscriptionPlanResponse> getAll() {

        return subscriptionPlanRepository.findAll()
                .stream()
                .map(subscriptionPlanMapper::toResponse)
                .toList();

    }

    public SubscriptionPlanResponse getById(UUID id) {

        SubscriptionPlan plan = subscriptionPlanRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Subscription plan not found"));

        return subscriptionPlanMapper.toResponse(plan);

    }

    public SubscriptionPlanResponse create(SubscriptionPlanRequest request) {

        if (subscriptionPlanRepository.existsByName(request.getName())) {
            throw new RuntimeException("Subscription plan already exists");
        }

        SubscriptionPlan plan = subscriptionPlanMapper.toEntity(request);

        SubscriptionPlan savedPlan = subscriptionPlanRepository.save(plan);

        return subscriptionPlanMapper.toResponse(savedPlan);

    }

    public SubscriptionPlanResponse update(UUID id,
                                           SubscriptionPlanRequest request) {

        SubscriptionPlan plan = subscriptionPlanRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Subscription plan not found"));

        subscriptionPlanMapper.updateEntity(plan, request);

        SubscriptionPlan updatedPlan = subscriptionPlanRepository.save(plan);

        return subscriptionPlanMapper.toResponse(updatedPlan);

    }

    public void delete(UUID id) {

        SubscriptionPlan plan = subscriptionPlanRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Subscription plan not found"));

        subscriptionPlanRepository.delete(plan);

    }

}