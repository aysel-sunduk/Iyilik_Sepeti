package com.donatecommerce.service;

import java.util.List;
import com.donatecommerce.dto.response.DonationHubResponse;

public interface DonationHubService {
    List<DonationHubResponse> getNearHubs(Double latitude, Double longitude, Double radiusKm);
    List<DonationHubResponse> getAllActiveHubs();
}
