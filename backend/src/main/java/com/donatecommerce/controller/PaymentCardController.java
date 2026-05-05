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
import org.springframework.web.bind.annotation.RestController;

import com.donatecommerce.dto.request.CreateCardRequest;
import com.donatecommerce.dto.response.CardResponse;
import com.donatecommerce.service.PaymentCardService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/users/me/cards")
@RequiredArgsConstructor
@Tag(name = "Ödeme Kartları", description = "Kullanıcı kayıtlı kart yönetimi API'leri")
public class PaymentCardController {
    
    private final PaymentCardService cardService;
    
    @GetMapping
    @Operation(summary = "Kullanıcının kayıtlı kartlarını getir")
    public ResponseEntity<List<CardResponse>> getMyCards(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(cardService.getMyCards(userDetails.getUsername()));
    }
    
    @PostMapping
    @Operation(summary = "Yeni kart ekle")
    public ResponseEntity<CardResponse> addCard(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody CreateCardRequest request) {
        return ResponseEntity.ok(cardService.addCard(request, userDetails.getUsername()));
    }
    
    @DeleteMapping("/{cardId}")
    @Operation(summary = "Kayıtlı kartı sil")
    public ResponseEntity<Void> deleteCard(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable UUID cardId) {
        cardService.deleteCard(cardId, userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }
}
