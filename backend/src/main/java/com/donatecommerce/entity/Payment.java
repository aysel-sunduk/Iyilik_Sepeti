package com.donatecommerce.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "payments")
@Getter @Setter
public class Payment {

    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne
    private User user;

    private BigDecimal amount;

    private String paymentMethod;

    @Column(unique = true)
    private String transactionId;

    private String status;

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt;
}