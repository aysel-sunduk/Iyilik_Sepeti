package com.donatecommerce.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CreateCardRequest {
    @NotBlank
    private String cardHolderName;
    
    @NotBlank
    @Size(min = 16, max = 19)
    private String cardNumber;
    
    @NotBlank
    private String cardAlias;
    
    @NotBlank
    @Size(min = 2, max = 2)
    private String expiryMonth;
    
    @NotBlank
    @Size(min = 2, max = 4)
    private String expiryYear;
    
    @NotBlank
    @Size(min = 3, max = 4)
    private String cvv;
    
    private Boolean isDefault = false;
}
