package com.donatecommerce.mapper;

import java.time.LocalDateTime;

import com.donatecommerce.dto.response.LoginResponse;
import com.donatecommerce.dto.response.RegisterResponse;
import com.donatecommerce.entity.User;

public final class UserMapper {
    private UserMapper() {
    }

    public static RegisterResponse toRegisterResponse(User user) {
        return RegisterResponse.builder()
                .userId(user.getId())
                .email(user.getEmail())
                .message("Kayıt başarılı")
                .build();
    }

    public static LoginResponse toLoginResponse(
            User user,
            String accessToken,
            String refreshToken,
            long expiresIn
    ) {
        String roleName = user.getRole() != null ? user.getRole().getName() : "USER";
        return LoginResponse.builder()
                .userId(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .role(roleName)
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .expiresIn(expiresIn)
                .loginTime(LocalDateTime.now())
                .build();
    }
}

