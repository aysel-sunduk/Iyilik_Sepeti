package com.donatecommerce.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.donatecommerce.dto.response.ApiResponse;
import com.donatecommerce.dto.response.DonationHubResponse;
import com.donatecommerce.service.DonationHubService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/hubs")
@CrossOrigin(origins = "*")
@Tag(name = "Bağış Noktaları", description = "Fiziksel toplama merkezleri ve saha etkinlikleri API'leri")
public class DonationHubController {

    @Autowired
    private DonationHubService donationHubService;

    @GetMapping("/near")
    @Operation(summary = "Kullanıcıya yakın olan bağış noktalarını getir")
    public ResponseEntity<ApiResponse<List<DonationHubResponse>>> getNearHubs(
            @RequestParam(required = false) Double lat,
            @RequestParam(required = false) Double lng,
            @RequestParam(required = false, defaultValue = "15.0") Double radius) {
        
        List<DonationHubResponse> hubs;
        if (lat != null && lng != null) {
            hubs = donationHubService.getNearHubs(lat, lng, radius);
        } else {
            hubs = donationHubService.getAllActiveHubs();
        }
        
        return ResponseEntity.ok(ApiResponse.success(hubs, "Yakındaki noktalar başarıyla getirildi"));
    }
}
