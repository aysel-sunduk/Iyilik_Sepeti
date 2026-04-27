package com.donatecommerce.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "campaigns")
@Getter @Setter
public class Campaign {

    @Id
    @GeneratedValue
    private UUID id;

    private String title;
    private String subtitle;

    @Column(columnDefinition = "TEXT")
    private String description;

    private BigDecimal targetAmount;
    private BigDecimal collectedAmount;

    private String campaignType;
    private String imageUrl;

    private LocalDate deadline;
    private String location;

    @ManyToOne
    @JoinColumn(name = "created_by")
    private User createdBy;

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt;

    private Boolean isActive;
    private Boolean isDeleted;
}