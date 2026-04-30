package com.donatecommerce.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CampaignResponse {
    
    private UUID id;
    private String title;
    private String description;
    private String imageUrl;
    private BigDecimal targetAmount;
    private BigDecimal raisedAmount;
    private String unit;
    private Integer targetCount;
    private Integer raisedCount;
    private boolean isActive;
    private Double progressPercentage;
    private LocalDateTime createdAt;
    
    public void calculateProgressPercentage() {
        if (targetAmount != null && targetAmount.compareTo(BigDecimal.ZERO) > 0) {
            this.progressPercentage = raisedAmount.doubleValue() / targetAmount.doubleValue() * 100;
        } else if (targetCount != null && targetCount > 0) {
            this.progressPercentage = (double) raisedCount / targetCount * 100;
        } else {
            this.progressPercentage = 0.0;
        }
    }
}