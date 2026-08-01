package com.example.backend.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class DatabaseSchemaUpdater implements ApplicationRunner {

    private final JdbcTemplate jdbcTemplate;

    @Override
    public void run(ApplicationArguments args) {
        dropSessionLimitColumnIfExists();
    }

    private void dropSessionLimitColumnIfExists() {
        try {
            Integer columnExists = jdbcTemplate.queryForObject(
                    """
                    SELECT COUNT(*)
                    FROM information_schema.columns
                    WHERE table_name = 'subscription_plan_options'
                      AND column_name = 'session_limit'
                    """,
                    Integer.class
            );

            if (columnExists != null && columnExists > 0) {
                jdbcTemplate.execute(
                        "ALTER TABLE subscription_plan_options DROP COLUMN session_limit"
                );
                log.info("Dropped deprecated session_limit column from subscription_plan_options");
            }
        } catch (Exception exception) {
            log.warn("Could not update subscription_plan_options schema: {}", exception.getMessage());
        }
    }

}
