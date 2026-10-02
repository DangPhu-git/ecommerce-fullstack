package com.Hoctructuyenchieu.Ecommerce.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DatabaseInitializer implements ApplicationRunner {

    private final JdbcTemplate jdbcTemplate;

    @Override
    public void run(ApplicationArguments args) {
        try {
            log.info("Updating database check constraint for orders_payment_method...");
            jdbcTemplate.execute("ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_payment_method_check");
            jdbcTemplate.execute("""
                ALTER TABLE orders 
                ADD CONSTRAINT orders_payment_method_check 
                CHECK (payment_method IN ('COD', 'BANK_TRANSFER', 'CREDIT_CARD', 'VNPAY'))
            """);
            log.info("Database constraint 'orders_payment_method_check' updated successfully with VNPAY.");
        } catch (Exception e) {
            log.warn("DatabaseInitializer error: {}", e.getMessage());
        }
    }
}
