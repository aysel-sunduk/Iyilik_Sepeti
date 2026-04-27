package com.donatecommerce.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "users")
@Getter @Setter
public class User {

    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "role_id")
    private Role role;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Column(columnDefinition = "TEXT")
    private String refreshToken;
    private LocalDateTime refreshTokenExpiresAt;

    private String firstName;
    private String lastName;

    private String phone;
    private String avatarUrl;

    private LocalDate birthDate;
    private String gender;

    private Boolean phoneVerified;
    private LocalDateTime lastLogin;

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt;

    private Boolean isActive;
    private Boolean isDeleted;
}
