package com.donatecommerce.entity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "users")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
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
    
    @Builder.Default
    private BigDecimal walletBalance = BigDecimal.ZERO;
    
    // Manuel getter - OrderService'de getFullName() diye çağırdığın için
    public String getFullName() {
        if (firstName != null && lastName != null) {
            return firstName + " " + lastName;
        } else if (firstName != null) {
            return firstName;
        } else if (lastName != null) {
            return lastName;
        }
        return email; // fallback
    }
}