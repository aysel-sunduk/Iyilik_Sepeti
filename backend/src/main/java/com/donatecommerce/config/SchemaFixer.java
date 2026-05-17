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

            // Categories table fixes
            jdbcTemplate.execute("ALTER TABLE categories ALTER COLUMN description TYPE TEXT");
            jdbcTemplate.execute("ALTER TABLE categories ALTER COLUMN image_url TYPE TEXT");
            
            // Donation Status constraint and data fix
            try {
                jdbcTemplate.execute("ALTER TABLE donations DROP CONSTRAINT IF EXISTS donations_status_check");
            } catch (Exception ex) {
                // Ignore if it doesn't exist or other error
            }
            jdbcTemplate.execute("UPDATE donations SET status = UPPER(status) WHERE status IS NOT NULL");
            
            // Old mock notes cleanup
            try {
                jdbcTemplate.execute("UPDATE donations SET notes = 'Afet bölgesindeki çocuklara moral vermesi ricasıyla, özenle paketlensin lütfen.' WHERE notes LIKE '%Admin%mock%' OR notes LIKE '%Admin%bağış%'");
                jdbcTemplate.execute("UPDATE donations SET notes = 'Yetimhanedeki kardeşlerimize bir nebze de olsa tebessüm olsun diye gönderiyorum.' WHERE notes LIKE '%Standart%mock%' OR notes LIKE '%Standart%bağış%'");
                jdbcTemplate.execute("UPDATE donations SET notes = 'Eğitim desteği kapsamında ihtiyaç sahiplerine dağıtılması için.' WHERE notes LIKE '%Saha%mock%' OR notes LIKE '%Saha%bağış%'");
                jdbcTemplate.execute("UPDATE donations SET notes = 'Çocuk esirgeme kurumundaki etkinlik için bağışlıyorum.' WHERE notes LIKE '%Admin%ulaşmış%'");
                jdbcTemplate.execute("UPDATE donations SET notes = 'Sokak hayvanları yararına mama ve destek amaçlıdır.' WHERE notes LIKE '%Standart%ulaşmış%'");
                jdbcTemplate.execute("UPDATE donations SET notes = 'Kışlık giyecek yardımı kampanyası kapsamında dağıtılması ricasıyla.' WHERE notes LIKE '%Saha%ulaşmış%'");
            } catch (Exception ex) {
                // Ignore if any issue
            }
            
            log.info("Schema and data fixes completed successfully.");
        } catch (Exception e) {
            log.warn("Schema fix encountered an issue (it might already be fixed): {}", e.getMessage());
        }
    }
}
