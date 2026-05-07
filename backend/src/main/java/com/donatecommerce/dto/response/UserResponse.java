package com.donatecommerce.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;

import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    
    private UUID id;
    private String email;
    private String firstName;
    private String lastName;
    private String phone;
    private String avatarUrl;
    private LocalDate birthDate;
    private String gender;
    private Boolean phoneVerified;
    private String role;
    private Boolean isActive;
    private BigDecimal walletBalance;
    private BigDecimal iyilikBalance;
    private LocalDateTime createdAt;
    private LocalDateTime lastLogin;
}