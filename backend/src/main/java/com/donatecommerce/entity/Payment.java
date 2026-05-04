package com.donatecommerce.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "payments")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder  // BU EKLENDİ
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