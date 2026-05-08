// controller/CampaignController.java
package com.donatecommerce.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.donatecommerce.dto.request.CampaignCreateRequest;
import com.donatecommerce.dto.response.ApiResponse;
import com.donatecommerce.dto.response.CampaignResponse;
import com.donatecommerce.service.CampaignService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;

import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("/api/campaigns")
@CrossOrigin(origins = "*")
@Tag(name = "Kampanyalar", description = "Bağış kampanyaları API'leri")
public class CampaignController {
    
    @Autowired
    private CampaignService campaignService;
    
    @GetMapping
    @Operation(summary = "Tüm kampanyaları getir")
    public ResponseEntity<ApiResponse<List<CampaignResponse>>> getAllCampaigns(HttpServletRequest request) {
        List<CampaignResponse> campaigns = campaignService.getAllCampaigns();
        return ResponseEntity.ok(ApiResponse.success(campaigns, "Kampanyalar başarıyla getirildi"));
    }
    
    @GetMapping("/active")
    @Operation(summary = "Aktif kampanyaları getir")
    public ResponseEntity<ApiResponse<List<CampaignResponse>>> getActiveCampaigns(HttpServletRequest request) {
        List<CampaignResponse> campaigns = campaignService.getActiveCampaigns();
        return ResponseEntity.ok(ApiResponse.success(campaigns, "Aktif kampanyalar başarıyla getirildi"));
    }
    
    @GetMapping("/ongoing")
    @Operation(summary = "Devam eden kampanyaları getir")
    public ResponseEntity<ApiResponse<List<CampaignResponse>>> getOngoingCampaigns(HttpServletRequest request) {
        List<CampaignResponse> campaigns = campaignService.getOngoingCampaigns();
        return ResponseEntity.ok(ApiResponse.success(campaigns, "Devam eden kampanyalar başarıyla getirildi"));
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "ID'ye göre kampanya getir")
    public ResponseEntity<ApiResponse<CampaignResponse>> getCampaignById(
            @PathVariable UUID id,
            HttpServletRequest request) {
        try {
            CampaignResponse campaign = campaignService.getCampaignById(id);
            return ResponseEntity.ok(ApiResponse.success(campaign, "Kampanya başarıyla getirildi"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage(), request.getRequestURI()));
        }
    }
    
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Yeni kampanya oluştur")
    public ResponseEntity<ApiResponse<CampaignResponse>> createCampaign(
            @RequestBody CampaignCreateRequest request,
            HttpServletRequest httpRequest) {
        try {
            CampaignResponse createdCampaign = campaignService.createCampaign(request);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success(createdCampaign, "Kampanya başarıyla oluşturuldu"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage(), httpRequest.getRequestURI()));
        }
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Kampanya güncelle")
    public ResponseEntity<ApiResponse<CampaignResponse>> updateCampaign(
            @PathVariable UUID id,
            @RequestBody CampaignCreateRequest request,
            HttpServletRequest httpRequest) {
        try {
            CampaignResponse updatedCampaign = campaignService.updateCampaign(id, request);
            return ResponseEntity.ok(ApiResponse.success(updatedCampaign, "Kampanya başarıyla güncellendi"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage(), httpRequest.getRequestURI()));
        }
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Kampanya sil")
    public ResponseEntity<ApiResponse<Void>> deleteCampaign(
            @PathVariable UUID id,
            HttpServletRequest request) {
        try {
            campaignService.deleteCampaign(id);
            return ResponseEntity.ok(ApiResponse.success(null, "Kampanya başarıyla silindi"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage(), request.getRequestURI()));
        }
    }
}