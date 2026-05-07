package com.donatecommerce.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.donatecommerce.dto.response.ProductResponse;
import com.donatecommerce.entity.Favorite;
import com.donatecommerce.entity.User;
import com.donatecommerce.repository.FavoriteRepository;
import com.donatecommerce.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FavoriteServiceImpl implements FavoriteService {

    private final FavoriteRepository favoriteRepository;
    private final UserRepository userRepository;
    private final ProductService productService;

    @Override
    public List<ProductResponse> getMyFavoriteProducts(String email) {
        User user = userRepository.findByEmailIgnoreCase(email)
            .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı: " + email));
            
        List<Favorite> favorites = favoriteRepository.findByUserIdAndEntityType(user.getId(), "product");
        
        return favorites.stream()
            .map(fav -> {
                try {
                    return productService.getProductById(fav.getEntityId());
                } catch (Exception e) {
                    return null; // Product might be deleted
                }
            })
            .filter(p -> p != null)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public boolean toggleFavoriteProduct(String email, UUID productId) {
        User user = userRepository.findByEmailIgnoreCase(email)
            .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı: " + email));
            
        // Check if product exists
        productService.getProductById(productId);
            
        Optional<Favorite> existingFav = favoriteRepository.findByUserIdAndEntityTypeAndEntityId(user.getId(), "product", productId);
        
        if (existingFav.isPresent()) {
            favoriteRepository.delete(existingFav.get());
            return false; // Removed
        } else {
            Favorite favorite = new Favorite();
            favorite.setUser(user);
            favorite.setEntityType("product");
            favorite.setEntityId(productId);
            favorite.setCreatedAt(LocalDateTime.now());
            favoriteRepository.save(favorite);
            return true; // Added
        }
    }
}
