package com.example.backend.service;

import com.example.backend.Entity.SubscriptionPlan;
import com.example.backend.Entity.SubscriptionPlanOption;
import com.example.backend.Repository.SubscriptionPlanOptionRepository;
import com.example.backend.Repository.SubscriptionPlanRepository;
import com.example.backend.dto.SubscriptionPlanOptionRequest;
import com.example.backend.dto.SubscriptionPlanOptionResponse;
import com.example.backend.mapper.SubscriptionPlanOptionMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SubscriptionPlanOptionService {

    private final SubscriptionPlanOptionRepository subscriptionPlanOptionRepository;
    private final SubscriptionPlanRepository subscriptionPlanRepository;
    private final SubscriptionPlanOptionMapper subscriptionPlanOptionMapper;

    public List<SubscriptionPlanOptionResponse> getAll() {

        return subscriptionPlanOptionRepository.findAll()
                .stream()
                .map(subscriptionPlanOptionMapper::toResponse)
                .toList();

    }

    public List<SubscriptionPlanOptionResponse> getBySubscriptionPlan(UUID subscriptionPlanId) {

        return subscriptionPlanOptionRepository.findBySubscriptionPlanId(subscriptionPlanId)
                .stream()
                .map(subscriptionPlanOptionMapper::toResponse)
                .toList();

    }

    public SubscriptionPlanOptionResponse getById(UUID id) {

        SubscriptionPlanOption option = subscriptionPlanOptionRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Subscription plan option not found"));

        return subscriptionPlanOptionMapper.toResponse(option);

    }

    public SubscriptionPlanOptionResponse create(
            SubscriptionPlanOptionRequest request
    ) {

        SubscriptionPlan subscriptionPlan =
                subscriptionPlanRepository.findById(request.getSubscriptionPlanId())
                        .orElseThrow(() ->
                                new RuntimeException("Subscription plan not found"));

        if (subscriptionPlanOptionRepository
                .existsBySubscriptionPlanIdAndOptionType(
                        request.getSubscriptionPlanId(),
                        request.getOptionType())) {

            throw new RuntimeException(
                    "Option type already exists for this subscription plan");
        }

        SubscriptionPlanOption option =
                subscriptionPlanOptionMapper.toEntity(
                        request,
                        subscriptionPlan
                );

        SubscriptionPlanOption saved =
                subscriptionPlanOptionRepository.save(option);

        return subscriptionPlanOptionMapper.toResponse(saved);

    }

    public SubscriptionPlanOptionResponse update(
            UUID id,
            SubscriptionPlanOptionRequest request
    ) {

        SubscriptionPlanOption option =
                subscriptionPlanOptionRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException("Subscription plan option not found"));

        SubscriptionPlan subscriptionPlan =
                subscriptionPlanRepository.findById(request.getSubscriptionPlanId())
                        .orElseThrow(() ->
                                new RuntimeException("Subscription plan not found"));

        option.setSubscriptionPlan(subscriptionPlan);
        option.setOptionType(request.getOptionType());
        option.setPrice(request.getPrice());

        SubscriptionPlanOption updated =
                subscriptionPlanOptionRepository.save(option);

        return subscriptionPlanOptionMapper.toResponse(updated);

    }

    public void delete(UUID id) {

        SubscriptionPlanOption option =
                subscriptionPlanOptionRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException("Subscription plan option not found"));


        subscriptionPlanOptionRepository.delete(option);

    }

}