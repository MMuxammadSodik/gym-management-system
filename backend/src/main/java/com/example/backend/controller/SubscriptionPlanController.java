package com.example.backend.controller;

import com.example.backend.dto.SubscriptionPlanRequest;
import com.example.backend.dto.SubscriptionPlanResponse;
import com.example.backend.service.SubscriptionPlanService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/subscription-plans")
@RequiredArgsConstructor
public class SubscriptionPlanController {

    private final SubscriptionPlanService subscriptionPlanService;

    @GetMapping
    public List<SubscriptionPlanResponse> getAll() {
        return subscriptionPlanService.getAll();
    }

    @GetMapping("/{id}")
    public SubscriptionPlanResponse getById(@PathVariable UUID id) {
        return subscriptionPlanService.getById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public SubscriptionPlanResponse create(
            @RequestBody SubscriptionPlanRequest request
    ) {
        return subscriptionPlanService.create(request);
    }

    @PutMapping("/{id}")
    public SubscriptionPlanResponse update(
            @PathVariable UUID id,
            @RequestBody SubscriptionPlanRequest request
    ) {
        return subscriptionPlanService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id) {
        subscriptionPlanService.delete(id);
    }

}