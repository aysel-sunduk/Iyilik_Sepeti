package com.donatecommerce.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UpdateAddressRequest {
    
    @NotBlank(message = "Adres başlığı zorunludur")
    private String title;
    
    @NotBlank(message = "Şehir zorunludur")
    private String city;
    
    @NotBlank(message = "İlçe zorunludur")
    private String district;
    
    @NotBlank(message = "Adres satırı zorunludur")
    private String addressLine;
    
    private String postalCode;
    
    private Boolean isDefault;
}