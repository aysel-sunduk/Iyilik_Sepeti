package com.donatecommerce.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.UUID;

@Data
public class OrderItemRequest {
    
    @NotNull(message = "Ürün ID zorunludur")
    private UUID productId;
    
    @Min(value = 1, message = "Miktar en az 1 olmalıdır")
    @NotNull(message = "Miktar zorunludur")
    private Integer quantity;
}