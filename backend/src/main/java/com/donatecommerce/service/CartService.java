package com.donatecommerce.service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.donatecommerce.dto.request.UpdateCartRequest;
import com.donatecommerce.dto.response.CartItemResponse;
import com.donatecommerce.entity.CartItem;
import com.donatecommerce.entity.Product;
import com.donatecommerce.entity.User;
import com.donatecommerce.exception.ResourceNotFoundException;
import com.donatecommerce.repository.CartItemRepository;
import com.donatecommerce.repository.ProductRepository;
import com.donatecommerce.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CartService {
    
    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    
    public List<CartItemResponse> getMyCart(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Kullanıcı bulunamadı"));
        
        return cartItemRepository.findByUserId(user.getId()).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public CartItemResponse addToCart(UpdateCartRequest request, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Kullanıcı bulunamadı"));
        
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Ürün bulunamadı"));
        
        CartItem cartItem = cartItemRepository
                .findByUserIdAndProductIdAndType(user.getId(), request.getProductId(), request.getType())
                .orElse(CartItem.builder()
                        .user(user)
                        .product(product)
                        .type(request.getType())
                        .build());
        
        cartItem.setQuantity(request.getQuantity());
        cartItem = cartItemRepository.save(cartItem);
        
        return mapToResponse(cartItem);
    }
    
    @Transactional
    public void removeFromCart(UUID productId, String type, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Kullanıcı bulunamadı"));
        
        cartItemRepository.deleteByUserIdAndProductIdAndType(user.getId(), productId, type);
    }
    
    @Transactional
    public void clearCart(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Kullanıcı bulunamadı"));
        
        cartItemRepository.deleteByUserId(user.getId());
    }
    
    private CartItemResponse mapToResponse(CartItem item) {
        CartItemResponse response = new CartItemResponse();
        response.setId(item.getId());
        response.setProductId(item.getProduct().getId());
        response.setName(item.getProduct().getName());
        response.setImageUrl(item.getProduct().getImageUrl());
        response.setPrice(item.getProduct().getPrice());
        response.setQuantity(item.getQuantity());
        response.setType(item.getType());
        return response;
    }
}
