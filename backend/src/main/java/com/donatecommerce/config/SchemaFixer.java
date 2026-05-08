package com.donatecommerce.config;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Configuration
public class SchemaFixer {

    private static final Logger log = LoggerFactory.getLogger(SchemaFixer.class);

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @PostConstruct
    public void fixSchema() {
        log.info("Checking and fixing database schema constraints...");
        try {
            // Products table fixes
            jdbcTemplate.execute("ALTER TABLE products ALTER COLUMN description TYPE TEXT");
            jdbcTemplate.execute("ALTER TABLE products ALTER COLUMN image_url TYPE TEXT");
            
            // Campaigns table fixes
            jdbcTemplate.execute("ALTER TABLE campaigns ALTER COLUMN description TYPE TEXT");
            jdbcTemplate.execute("ALTER TABLE campaigns ALTER COLUMN image_url TYPE TEXT");
            
            log.info("Schema fix completed successfully.");
        } catch (Exception e) {
            log.warn("Schema fix encountered an issue (it might already be fixed): {}", e.getMessage());
        }
    }
}
