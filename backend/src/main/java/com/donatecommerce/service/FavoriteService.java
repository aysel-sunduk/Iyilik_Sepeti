package com.donatecommerce.service;

import java.util.List;
import java.util.UUID;
import com.donatecommerce.dto.response.ProductResponse;

public interface FavoriteService {
    List<ProductResponse> getMyFavoriteProducts(String email);
    boolean toggleFavoriteProduct(String email, UUID productId);
}
