package com.donatecommerce.service;



import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.donatecommerce.dto.response.UserResponse;
import com.donatecommerce.entity.User;
import com.donatecommerce.exception.ResourceNotFoundException;
import com.donatecommerce.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {
    
    private final UserRepository userRepository;
    
    public UserResponse getCurrentUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Kullanıcı bulunamadı"));
        
        return mapToUserResponse(user);
    }
    
    @Transactional
    public UserResponse updateProfile(String email, UserResponse request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Kullanıcı bulunamadı"));
        
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setPhone(request.getPhone());
        user.setAvatarUrl(request.getAvatarUrl());
        
        user = userRepository.save(user);
        return mapToUserResponse(user);
    }
    
    @Transactional
    public UserResponse topUpWallet(String email, java.math.BigDecimal amount) {
        if (amount == null || amount.compareTo(java.math.BigDecimal.ZERO) <= 0) {
            throw new com.donatecommerce.exception.BadRequestException("Yüklenecek tutar sıfırdan büyük olmalıdır");
        }
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Kullanıcı bulunamadı"));
        
        java.math.BigDecimal currentBalance = user.getWalletBalance() != null ? user.getWalletBalance() : java.math.BigDecimal.ZERO;
        user.setWalletBalance(currentBalance.add(amount));
        
        user = userRepository.save(user);
        return mapToUserResponse(user);
    }
    
    private UserResponse mapToUserResponse(User user) {
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setEmail(user.getEmail());
        response.setFirstName(user.getFirstName());
        response.setLastName(user.getLastName());
        response.setPhone(user.getPhone());
        response.setAvatarUrl(user.getAvatarUrl());
        response.setRole(user.getRole() != null ? user.getRole().getName() : "USER");
        
        // Null güvenliği: Eğer veritabanında null ise 0 olarak dön
        response.setWalletBalance(user.getWalletBalance() != null ? user.getWalletBalance() : java.math.BigDecimal.ZERO);
        response.setIyilikBalance(user.getIyilikBalance() != null ? user.getIyilikBalance() : java.math.BigDecimal.ZERO);
        
        response.setCreatedAt(user.getCreatedAt());
        return response;
    }
}
