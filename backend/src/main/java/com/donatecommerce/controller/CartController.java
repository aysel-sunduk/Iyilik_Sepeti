package com.donatecommerce.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.donatecommerce.dto.request.UpdateCartRequest;
import com.donatecommerce.dto.response.CartItemResponse;
import com.donatecommerce.service.CartService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
@Tag(name = "Sepet", description = "Sepet yönetimi API'leri")
public class CartController {
    
    private final CartService cartService;
    
    @GetMapping
    @Operation(summary = "Kullanıcının sepetini getir")
    public ResponseEntity<List<CartItemResponse>> getMyCart(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(cartService.getMyCart(userDetails.getUsername()));
    }
    
    @PostMapping
    @Operation(summary = "Sepete ürün ekle veya güncelle")
    public ResponseEntity<CartItemResponse> addToCart(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody UpdateCartRequest request) {
        return ResponseEntity.ok(cartService.addToCart(request, userDetails.getUsername()));
    }
    
    @DeleteMapping("/{productId}")
    @Operation(summary = "Sepetten ürün çıkar")
    public ResponseEntity<Void> removeFromCart(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable UUID productId,
            @RequestParam String type) {
        cartService.removeFromCart(productId, type, userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }
    
    @DeleteMapping("/clear")
    @Operation(summary = "Sepeti tamamen temizle")
    public ResponseEntity<Void> clearCart(@AuthenticationPrincipal UserDetails userDetails) {
        cartService.clearCart(userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }
}
