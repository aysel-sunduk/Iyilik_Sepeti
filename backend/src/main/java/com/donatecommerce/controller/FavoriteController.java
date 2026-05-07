package com.donatecommerce.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.donatecommerce.dto.response.ApiResponse;
import com.donatecommerce.dto.response.ProductResponse;
import com.donatecommerce.service.FavoriteService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/favorites")
@RequiredArgsConstructor
@Tag(name = "Favoriler", description = "Kullanıcı favori yönetimi API'leri")
public class FavoriteController {
    
    private final FavoriteService favoriteService;

    @GetMapping("/products")
    @Operation(summary = "Favori ürünleri getir")
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getMyFavorites(
            @AuthenticationPrincipal UserDetails userDetails) {
        List<ProductResponse> products = favoriteService.getMyFavoriteProducts(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(products, "Favori ürünler getirildi"));
    }

    @PostMapping("/products/{productId}")
    @Operation(summary = "Favorilere ekle veya çıkar (toggle)")
    public ResponseEntity<ApiResponse<Boolean>> toggleFavorite(
            @PathVariable UUID productId,
            @AuthenticationPrincipal UserDetails userDetails) {
        boolean isFavorite = favoriteService.toggleFavoriteProduct(userDetails.getUsername(), productId);
        return ResponseEntity.ok(ApiResponse.success(isFavorite, isFavorite ? "Favorilere eklendi" : "Favorilerden çıkarıldı"));
    }
}
