package com.donatecommerce.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "proof_photos")
@Getter @Setter
public class DonationProof {

    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne
    private Donation donation;

    @ManyToOne
    private User uploadedBy;

    private String imageUrl;

    private String caption;

    @Column(columnDefinition = "TEXT")
    private String message;

    private LocalDateTime createdAt = LocalDateTime.now();
}