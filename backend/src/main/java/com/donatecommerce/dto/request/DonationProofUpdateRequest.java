package com.donatecommerce.dto.request;

import lombok.Data;

@Data
public class DonationProofUpdateRequest {
    private String proofImageUrl;
    private String beneficiary;
}
