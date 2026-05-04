package com.donatecommerce.dto.response;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class AddressResponse {
    private UUID id;
    private UUID userId;
    private String title;
    private String city;
    private String district;
    private String addressLine;
    private String postalCode;
    private Boolean isDefault;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}