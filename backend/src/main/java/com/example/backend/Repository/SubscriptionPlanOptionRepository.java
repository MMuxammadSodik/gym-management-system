package com.example.backend.Repository;

import com.example.backend.Entity.SubscriptionPlanOption;
import com.example.backend.Entity.SubscriptionOptionType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface SubscriptionPlanOptionRepository extends JpaRepository<SubscriptionPlanOption, UUID> {

    List<SubscriptionPlanOption> findBySubscriptionPlanId(UUID subscriptionPlanId);

    Optional<SubscriptionPlanOption> findBySubscriptionPlanIdAndOptionType(
            UUID subscriptionPlanId,
            SubscriptionOptionType optionType
    );

    boolean existsBySubscriptionPlanIdAndOptionType(
            UUID subscriptionPlanId,
            SubscriptionOptionType optionType
    );

}