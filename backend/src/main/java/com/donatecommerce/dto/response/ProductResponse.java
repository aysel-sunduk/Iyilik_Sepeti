package com.donatecommerce.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductResponse {
    
    private UUID id;
    private String name;
    private String description;
    private String category;
    private BigDecimal price;
    private String imageUrl;
    private Integer stockQuantity;
    private Integer donationCount;
    private CampaignResponse campaign;
    private String unit;
    private Boolean isDonationProduct;
    private LocalDateTime createdAt;
    private Boolean isActive;
}