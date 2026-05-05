package com.donatecommerce.dto.response;

import java.math.BigDecimal;
import java.util.UUID;
import lombok.Data;

@Data
public class CartItemResponse {
    private UUID id;
    private UUID productId;
    private String name;
    private String imageUrl;
    private BigDecimal price;
    private Integer quantity;
    private String type;
}
