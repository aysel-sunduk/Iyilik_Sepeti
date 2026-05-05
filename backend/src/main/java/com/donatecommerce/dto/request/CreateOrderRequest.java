package com.donatecommerce.dto.request;

import java.util.List;
import java.util.UUID;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class CreateOrderRequest {
    
    @NotEmpty(message = "En az bir ürün eklemelisiniz")
    @Valid
    private List<OrderItemRequest> items;
    
    @NotNull(message = "Teslimat adresi zorunludur")
    private UUID shippingAddressId;
    
    @NotBlank(message = "Ödeme yöntemi zorunludur")
    @Pattern(regexp = "^(CREDIT_CARD|DEBIT_CARD|TRANSFER|WALLET)$", 
             message = "Geçersiz ödeme yöntemi. Geçerli değerler: CREDIT_CARD, DEBIT_CARD, TRANSFER, WALLET")
    private String paymentMethod;
    
    @NotBlank(message = "Sipariş tipi zorunludur")
    @Pattern(regexp = "^(PERSONAL|GIFT)$", 
             message = "Sipariş tipi PERSONAL veya GIFT olmalıdır")
    private String orderType;
    
    private String receiverName;  // GIFT için zorunlu
    private String giftMessage;   // GIFT için opsiyonel
    private Double roundUpAmount; // Yuvarlama farkı
}