package com.donatecommerce.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "proof_photo_likes")
@Getter @Setter
public class ProofPhotoLike {

    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne
    private DonationProof photo;

    @ManyToOne
    private User user;

    private LocalDateTime createdAt = LocalDateTime.now();
}