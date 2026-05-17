package com.donatecommerce.controller;

import com.donatecommerce.dto.request.DonationProofUpdateRequest;
import com.donatecommerce.dto.response.ApiResponse;
import com.donatecommerce.dto.response.DonationResponse;
import com.donatecommerce.service.DonationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/donations")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Tag(name = "Bağışlar", description = "Bağış takip ve yönetim API'leri")
public class DonationController {

    private final DonationService donationService;

    @GetMapping("/my")
    @Operation(summary = "Kullanıcının kendi bağışlarını getir")
    public ResponseEntity<ApiResponse<List<DonationResponse>>> getMyDonations(Principal principal) {
        List<DonationResponse> donations = donationService.getMyDonations(principal.getName());
        return ResponseEntity.ok(ApiResponse.success(donations, "Bağışlarınız başarıyla getirildi"));
    }

    @GetMapping("/campaign/{campaignId}")
    @Operation(summary = "Belirli bir kampanyaya yapılan bağışları getir")
    public ResponseEntity<ApiResponse<List<DonationResponse>>> getCampaignDonations(@PathVariable UUID campaignId) {
        List<DonationResponse> donations = donationService.getCampaignDonations(campaignId);
        return ResponseEntity.ok(ApiResponse.success(donations, "Kampanya bağışları başarıyla getirildi"));
    }

    @GetMapping("/all")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    @Operation(summary = "Tüm bağışları getir (Yönetim için)")
    public ResponseEntity<ApiResponse<List<DonationResponse>>> getAllDonations() {
        List<DonationResponse> donations = donationService.getAllDonations();
        return ResponseEntity.ok(ApiResponse.success(donations, "Tüm bağışlar başarıyla getirildi"));
    }

    @PatchMapping("/{donationId}/proof")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    @Operation(summary = "Bağışa kanıt fotoğrafı ve ihtiyaç sahibi bilgisi ekle (Admin ve Saha Ekibi yetkili)")
    public ResponseEntity<ApiResponse<DonationResponse>> updateProof(
            @PathVariable UUID donationId,
            @RequestBody DonationProofUpdateRequest request) {
        DonationResponse updatedDonation = donationService.updateDonationProof(
                donationId, 
                request.getProofImageUrl(), 
                request.getBeneficiary());
        return ResponseEntity.ok(ApiResponse.success(updatedDonation, "Bağış kanıtı başarıyla eklendi"));
    }

    @PatchMapping("/{donationId}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    @Operation(summary = "Bağış durumunu güncelle (Admin ve Saha Ekibi yetkili)")
    public ResponseEntity<ApiResponse<DonationResponse>> updateStatus(
            @PathVariable UUID donationId,
            @RequestBody java.util.Map<String, String> request) {
        String statusStr = request.get("status");
        if (statusStr == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Status alanı zorunludur", "/api/donations/" + donationId + "/status"));
        }
        try {
            com.donatecommerce.entity.DonationStatus status = com.donatecommerce.entity.DonationStatus.valueOf(statusStr.toUpperCase());
            DonationResponse updatedDonation = donationService.updateDonationStatus(donationId, status);
            return ResponseEntity.ok(ApiResponse.success(updatedDonation, "Bağış durumu başarıyla güncellendi"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Geçersiz status değeri: " + statusStr, "/api/donations/" + donationId + "/status"));
        }
    }
}
