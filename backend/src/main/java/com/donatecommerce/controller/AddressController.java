package com.donatecommerce.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.donatecommerce.dto.request.CreateAddressRequest;
import com.donatecommerce.dto.request.UpdateAddressRequest;
import com.donatecommerce.dto.response.AddressResponse;
import com.donatecommerce.service.AddressService;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/users/me/addresses")
@RequiredArgsConstructor
@Tag(name = "Adresler", description = "Kullanıcı adres yönetimi API'leri")
public class AddressController {
    
    private final AddressService addressService;
    
    /**
     * Kullanıcının adreslerini listeleme
     * GET /api/users/me/addresses
     */
    @GetMapping
    public ResponseEntity<List<AddressResponse>> getMyAddresses(
            @AuthenticationPrincipal UserDetails userDetails) {
        
        List<AddressResponse> addresses = addressService.getMyAddresses(userDetails.getUsername());
        return ResponseEntity.ok(addresses);
    }
    
    /**
     * Adres detayı
     * GET /api/users/me/addresses/{addressId}
     */
    @GetMapping("/{addressId}")
    public ResponseEntity<AddressResponse> getAddressById(
            @PathVariable UUID addressId,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        AddressResponse response = addressService.getAddressById(addressId, userDetails.getUsername());
        return ResponseEntity.ok(response);
    }
    
    /**
     * Yeni adres ekleme
     * POST /api/users/me/addresses
     */
    @PostMapping
    public ResponseEntity<AddressResponse> addAddress(
            @RequestBody @Valid CreateAddressRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        AddressResponse response = addressService.addAddress(request, userDetails.getUsername());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    /**
     * Adres güncelleme
     * PUT /api/users/me/addresses/{addressId}
     */
    @PutMapping("/{addressId}")
    public ResponseEntity<AddressResponse> updateAddress(
            @PathVariable UUID addressId,
            @RequestBody @Valid UpdateAddressRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        AddressResponse response = addressService.updateAddress(
                addressId, request, userDetails.getUsername());
        return ResponseEntity.ok(response);
    }
    
    /**
     * Adres silme (soft delete)
     * DELETE /api/users/me/addresses/{addressId}
     */
    @DeleteMapping("/{addressId}")
    public ResponseEntity<Void> deleteAddress(
            @PathVariable UUID addressId,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        addressService.deleteAddress(addressId, userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }
    
    /**
     * Varsayılan adres yapma
     * PATCH /api/users/me/addresses/{addressId}/default
     */
    @PatchMapping("/{addressId}/default")
    public ResponseEntity<AddressResponse> setDefaultAddress(
            @PathVariable UUID addressId,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        AddressResponse response = addressService.setDefaultAddress(addressId, userDetails.getUsername());
        return ResponseEntity.ok(response);
    }
}