package com.donatecommerce.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import lombok.Data;

@Data
public class OrderResponse {
    private UUID id;
    private UUID buyerId;
    private String buyerName;
    private UUID paymentId;
    private String paymentStatus;
    private UUID shippingAddressId;
    private String shippingAddress;
    private BigDecimal totalAmount;
    private String status;
    private String statusDescription;
    private String orderType;
    private String receiverName;
    private String giftMessage;
    private String shippingCompany;
    private String trackingNumber;
    private LocalDateTime shippedAt;
    private LocalDateTime deliveredAt;
    private String shippingStatus;
    private int estimatedDays;
    private List<OrderItemResponse> items;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}