package com.donatecommerce.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DonationResponse {
    private UUID id;
    private UUID donorId;
    private String donorName;
    private UUID productId;
    private String productName;
    private UUID campaignId;
    private String campaignTitle;
    private Integer quantity;
    private BigDecimal amount;
    private String status;
    private String notes;
    private String proofImageUrl;
    private String beneficiary;
    private LocalDateTime createdAt;
    private LocalDateTime deliveredAt;
}
