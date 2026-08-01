package com.example.backend.controller;

import com.example.backend.dto.SubscriptionPlanOptionRequest;
import com.example.backend.dto.SubscriptionPlanOptionResponse;
import com.example.backend.service.SubscriptionPlanOptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/subscription-plan-options")
@RequiredArgsConstructor
public class SubscriptionPlanOptionController {

    private final SubscriptionPlanOptionService subscriptionPlanOptionService;

    @GetMapping
    public List<SubscriptionPlanOptionResponse> getAll() {
        return subscriptionPlanOptionService.getAll();
    }

    @GetMapping("/{id}")
    public SubscriptionPlanOptionResponse getById(
            @PathVariable UUID id
    ) {
        return subscriptionPlanOptionService.getById(id);
    }

    @GetMapping("/plan/{subscriptionPlanId}")
    public List<SubscriptionPlanOptionResponse> getBySubscriptionPlan(
            @PathVariable UUID subscriptionPlanId
    ) {
        return subscriptionPlanOptionService.getBySubscriptionPlan(subscriptionPlanId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public SubscriptionPlanOptionResponse create(
            @RequestBody SubscriptionPlanOptionRequest request
    ) {
        return subscriptionPlanOptionService.create(request);
    }

    @PutMapping("/{id}")
    public SubscriptionPlanOptionResponse update(
            @PathVariable UUID id,
            @RequestBody SubscriptionPlanOptionRequest request
    ) {
        return subscriptionPlanOptionService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id) {
        subscriptionPlanOptionService.delete(id);
    }

}