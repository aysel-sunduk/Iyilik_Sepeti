package com.donatecommerce.dto.response;

import java.util.UUID;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DonationHubResponse {
    private UUID id;
    private String name;
    private String description;
    private String type;
    private Double latitude;
    private Double longitude;
    private String address;
    private String imageUrl;
    private boolean isActive;
    private Double distanceKm; // Dynamic distance based on search coordinate
}
