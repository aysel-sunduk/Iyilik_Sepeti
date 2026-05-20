package com.donatecommerce.service;

import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.donatecommerce.dto.response.DonationHubResponse;
import com.donatecommerce.entity.DonationHub;
import com.donatecommerce.repository.DonationHubRepository;

@Service
public class DonationHubServiceImpl implements DonationHubService {

    @Autowired
    private DonationHubRepository donationHubRepository;

    @Override
    public List<DonationHubResponse> getNearHubs(Double latitude, Double longitude, Double radiusKm) {
        List<DonationHub> hubs = donationHubRepository.findByIsActiveTrue();
        
        return hubs.stream()
            .map(hub -> {
                double distance = 0.0;
                if (latitude != null && longitude != null) {
                    distance = calculateDistance(latitude, longitude, hub.getLatitude(), hub.getLongitude());
                }
                return DonationHubResponse.builder()
                    .id(hub.getId())
                    .name(hub.getName())
                    .description(hub.getDescription())
                    .type(hub.getType())
                    .latitude(hub.getLatitude())
                    .longitude(hub.getLongitude())
                    .address(hub.getAddress())
                    .imageUrl(hub.getImageUrl())
                    .isActive(hub.isActive())
                    .distanceKm(Math.round(distance * 100.0) / 100.0) // Round to 2 decimal places
                    .build();
            })
            .filter(hub -> radiusKm == null || hub.getDistanceKm() <= radiusKm)
            .sorted((h1, h2) -> Double.compare(h1.getDistanceKm(), h2.getDistanceKm()))
            .collect(Collectors.toList());
    }

    @Override
    public List<DonationHubResponse> getAllActiveHubs() {
        return getNearHubs(null, null, null);
    }

    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371; // Earth radius in km
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
}
