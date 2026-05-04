package com.donatecommerce.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "donations")
@Getter @Setter
public class Donation {

    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "donor_id")
    private User donor;

    @ManyToOne
    private Product product;

    @ManyToOne
    private Campaign campaign;

    @ManyToOne
    private Payment payment;

    private Integer quantity;
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    private DonationStatus status;

    @Column(columnDefinition = "TEXT")
    private String notes;

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime deliveredAt;
}