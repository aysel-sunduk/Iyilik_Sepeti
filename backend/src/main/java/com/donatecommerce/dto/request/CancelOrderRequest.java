package com.donatecommerce.dto.request;

import lombok.Data;

@Data
public class CancelOrderRequest {
    private String reason;
}