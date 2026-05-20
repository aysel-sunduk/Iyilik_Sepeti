package com.donatecommerce.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.donatecommerce.dto.response.UserResponse;
import com.donatecommerce.service.UserService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Tag(name = "Kullanıcı", description = "Kullanıcı profil yönetimi API'leri")
public class UserController {
    
    private final UserService userService;
    
    @GetMapping("/me")
    @Operation(summary = "Mevcut kullanıcı bilgilerini getir")
    public ResponseEntity<UserResponse> getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(userService.getCurrentUser(userDetails.getUsername()));
    }
    
    @PutMapping("/me")
    @Operation(summary = "Kullanıcı profilini güncelle")
    public ResponseEntity<UserResponse> updateProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody UserResponse request) {
        return ResponseEntity.ok(userService.updateProfile(userDetails.getUsername(), request));
    }
    
    @PostMapping("/wallet/topup")
    @Operation(summary = "Cüzdana bakiye yükle")
    public ResponseEntity<UserResponse> topUpWallet(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam java.math.BigDecimal amount) {
        return ResponseEntity.ok(userService.topUpWallet(userDetails.getUsername(), amount));
    }
}
