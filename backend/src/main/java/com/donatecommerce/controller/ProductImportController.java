package com.donatecommerce.controller;

import com.donatecommerce.dto.response.ApiResponse;
import com.donatecommerce.dto.response.ImportResponse;
import com.donatecommerce.service.SeedDataService;
import com.donatecommerce.service.WebScraperService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/import")
@RequiredArgsConstructor
@Tag(name = "Product Import", description = "Ürün içe aktarma ve Seed işlemleri")
public class ProductImportController {

    private final WebScraperService webScraperService;
    private final SeedDataService seedDataService;

    @PostMapping("/seed-turkish")
    @Operation(summary = "Eski Verileri Sil ve 100 Adet Hazır Türkçe Ürünü Yükle")
    public ResponseEntity<ApiResponse<ImportResponse>> seedTurkishProducts() {
        int count = seedDataService.cleanAndSeedTurkishProducts();
        
        ImportResponse response = ImportResponse.builder()
                .success(true)
                .message("Tüm eski veriler silindi ve " + count + " adet yeni Türkçe ürün/kategori başarıyla yüklendi.")
                .totalFetched(count)
                .totalSaved(count)
                .build();
        
        return ResponseEntity.ok(ApiResponse.success(response, "İşlem başarılı"));
    }

    @PostMapping("/n11")
    @Operation(summary = "N11'den arama yaparak ürün çek")
    public ResponseEntity<ApiResponse<ImportResponse>> scrapeN11(@RequestParam String keyword, @RequestParam(defaultValue = "10") int limit) {
        var products = webScraperService.scrapeN11(keyword, limit);
        return ResponseEntity.ok(ApiResponse.success(createResponse("N11", products.size()), "Tamamlandı"));
    }

    @PostMapping("/happycenter")
    @Operation(summary = "Happy Center'dan market ürünleri çek")
    public ResponseEntity<ApiResponse<ImportResponse>> scrapeHappyCenter(@RequestParam String category, @RequestParam(defaultValue = "10") int limit) {
        var products = webScraperService.scrapeHappyCenter(category, limit);
        return ResponseEntity.ok(ApiResponse.success(createResponse("Happy Center", products.size()), "Tamamlandı"));
    }

    private ImportResponse createResponse(String source, int count) {
        return ImportResponse.builder()
                .success(true)
                .message(source + " kaynağından " + count + " ürün çekildi.")
                .totalFetched(count)
                .totalSaved(count)
                .build();
    }
}