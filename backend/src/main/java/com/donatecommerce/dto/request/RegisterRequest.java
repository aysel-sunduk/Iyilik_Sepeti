package com.donatecommerce.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequest {

    @NotBlank(message = "E-posta bos olamaz")
    @Email(message = "Gecersiz e-posta formati")
    private String email;

    @NotBlank(message = "Sifre bos olamaz")
    @Size(min = 6, message = "Sifre en az 6 karakter olmalidir")
    private String password;

    @NotBlank(message = "Ad bos olamaz")
    private String firstName;

    @NotBlank(message = "Soyad bos olamaz")
    private String lastName;

    @Schema(example = "05555555555")
    private String phone;
}
