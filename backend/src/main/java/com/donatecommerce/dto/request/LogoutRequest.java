package com.donatecommerce.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LogoutRequest {
    @NotBlank(message = "Yenileme token'ı boş olamaz")
    private String refreshToken;
}
