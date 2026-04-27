package com.donatecommerce.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "orders")
@Getter @Setter
public class Order {

    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne
    private User buyer;

    @ManyToOne
    private Payment payment;

    @ManyToOne
    private Address shippingAddress;

    private BigDecimal totalAmount;

    private String status;

    private String shippingCompany;
    private String trackingNumber;

    private LocalDateTime shippedAt;
    private LocalDateTime deliveredAt;

    @Column(columnDefinition = "TEXT")
    private String notes;

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt;

    private Boolean isDeleted;
}