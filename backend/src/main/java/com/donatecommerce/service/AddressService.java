package com.donatecommerce.service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.donatecommerce.dto.request.CreateAddressRequest;
import com.donatecommerce.dto.request.UpdateAddressRequest;
import com.donatecommerce.dto.response.AddressResponse;
import com.donatecommerce.entity.Address;
import com.donatecommerce.entity.User;
import com.donatecommerce.exception.BadRequestException;
import com.donatecommerce.exception.ResourceNotFoundException;
import com.donatecommerce.repository.AddressRepository;
import com.donatecommerce.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AddressService {
    
    private final AddressRepository addressRepository;
    private final UserRepository userRepository;
    
    public List<AddressResponse> getMyAddresses(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Kullanıcı bulunamadı"));
        
        List<Address> addresses = addressRepository
                .findByUserIdAndIsDeletedFalseOrderByIsDefaultDescCreatedAtDesc(user.getId());
        
        return addresses.stream()
                .map(this::mapToAddressResponse)
                .collect(Collectors.toList());
    }
    
    public AddressResponse getAddressById(UUID addressId, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Kullanıcı bulunamadı"));
        
        Address address = addressRepository.findByIdAndUserIdAndIsDeletedFalse(addressId, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Adres bulunamadı"));
        
        return mapToAddressResponse(address);
    }
    
    @Transactional
    public AddressResponse addAddress(CreateAddressRequest request, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Kullanıcı bulunamadı"));
        
        // Maksimum adres limiti kontrolü (opsiyonel)
        long addressCount = addressRepository.countActiveAddressesByUser(user.getId());
        if (addressCount >= 10) {
            throw new BadRequestException("En fazla 10 adres ekleyebilirsiniz");
        }
        
        // Default adres kontrolü
        if (request.getIsDefault() != null && request.getIsDefault()) {
            addressRepository.removeDefaultAddress(user.getId());
        }
        
        Address address = Address.builder()
                .user(user)
                .title(request.getTitle())
                .city(request.getCity())
                .district(request.getDistrict())
                .addressLine(request.getAddressLine())
                .postalCode(request.getPostalCode())
                .isDefault(request.getIsDefault() != null ? request.getIsDefault() : false)
                .isDeleted(false)
                .build();
        
        address = addressRepository.save(address);
        return mapToAddressResponse(address);
    }
    
    @Transactional
    public AddressResponse updateAddress(UUID addressId, UpdateAddressRequest request, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Kullanıcı bulunamadı"));
        
        Address address = addressRepository.findByIdAndUserIdAndIsDeletedFalse(addressId, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Adres bulunamadı"));
        
        // Default adres değişikliği
        if (request.getIsDefault() != null && request.getIsDefault() && !address.getIsDefault()) {
            addressRepository.removeDefaultAddress(user.getId());
        }
        
        address.setTitle(request.getTitle());
        address.setCity(request.getCity());
        address.setDistrict(request.getDistrict());
        address.setAddressLine(request.getAddressLine());
        address.setPostalCode(request.getPostalCode());
        
        if (request.getIsDefault() != null) {
            address.setIsDefault(request.getIsDefault());
        }
        
        address = addressRepository.save(address);
        return mapToAddressResponse(address);
    }
    
    @Transactional
    public void deleteAddress(UUID addressId, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Kullanıcı bulunamadı"));
        
        Address address = addressRepository.findByIdAndUserIdAndIsDeletedFalse(addressId, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Adres bulunamadı"));
        
        if (address.getIsDefault()) {
            throw new BadRequestException(
                    "Varsayılan adresi silemezsiniz. Önce başka bir adresi varsayılan yapın.");
        }
        
        // Soft delete
        address.setIsDeleted(true);
        addressRepository.save(address);
    }
    
    @Transactional
    public AddressResponse setDefaultAddress(UUID addressId, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Kullanıcı bulunamadı"));
        
        Address address = addressRepository.findByIdAndUserIdAndIsDeletedFalse(addressId, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Adres bulunamadı"));
        
        // Diğer default'ları kaldır
        addressRepository.removeDefaultAddress(user.getId());
        
        // Bu adresi default yap
        address.setIsDefault(true);
        address = addressRepository.save(address);
        
        return mapToAddressResponse(address);
    }
    
    private AddressResponse mapToAddressResponse(Address address) {
        AddressResponse response = new AddressResponse();
        response.setId(address.getId());
        response.setUserId(address.getUser().getId());
        response.setTitle(address.getTitle());
        response.setCity(address.getCity());
        response.setDistrict(address.getDistrict());
        response.setAddressLine(address.getAddressLine());
        response.setPostalCode(address.getPostalCode());
        response.setIsDefault(address.getIsDefault());
        response.setCreatedAt(address.getCreatedAt());
        response.setUpdatedAt(address.getUpdatedAt());
        return response;
    }
}