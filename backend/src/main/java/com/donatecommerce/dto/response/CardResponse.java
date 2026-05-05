package com.donatecommerce.dto.response;

import java.util.UUID;
import lombok.Data;

@Data
public class CardResponse {
    private UUID id;
    private String cardHolderName;
    private String cardNumberLastFour;
    private String cardAlias;
    private String expiryMonth;
    private String expiryYear;
    private Boolean isDefault;
}
