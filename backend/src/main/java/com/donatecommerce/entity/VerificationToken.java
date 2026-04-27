package com.donatecommerce.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "verification_tokens")
@Getter @Setter
public class VerificationToken {

    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne
    private User user;

    private String token;
    private String type;

    private LocalDateTime expiresAt;
    private LocalDateTime usedAt;

    private LocalDateTime createdAt = LocalDateTime.now();
}