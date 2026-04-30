package com.donatecommerce.repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.donatecommerce.entity.Product;

@Repository
public interface ProductRepository extends JpaRepository<Product, UUID> {
    
    // Kategoriye göre getir
    List<Product> findByCategory(String category);
    
    // Kategoriye göre aktif ürünler (PAGE döner)
    Page<Product> findByCategoryAndIsActiveTrue(String category, Pageable pageable);
    
    // Tüm aktif ürünler
    @Query("SELECT p FROM Product p WHERE p.isActive = true AND p.isDeleted = false")
    Page<Product> findAllActiveProducts(Pageable pageable);
    
    // Bağış ürünleri (campaign'i olanlar) - LIST
    @Query("SELECT p FROM Product p WHERE p.campaign IS NOT NULL AND p.isActive = true AND p.isDeleted = false")
    List<Product> findDonationProducts();
    
    // Bağış ürünleri (campaign'i olanlar) - PAGE
    @Query("SELECT p FROM Product p WHERE p.campaign IS NOT NULL AND p.isActive = true AND p.isDeleted = false")
    Page<Product> findDonationProductsPage(Pageable pageable);
    
    // Popüler bağış ürünleri
    @Query("SELECT p FROM Product p WHERE p.campaign IS NOT NULL AND p.isActive = true AND p.isDeleted = false ORDER BY p.donationCount DESC")
    List<Product> findPopularDonationProducts(Pageable pageable);
    
    // Arama
    @Query("SELECT p FROM Product p WHERE p.isActive = true AND p.isDeleted = false AND " +
           "(LOWER(p.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(p.description) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(p.category) LIKE LOWER(CONCAT('%', :searchTerm, '%')))")
    Page<Product> searchProducts(@Param("searchTerm") String searchTerm, Pageable pageable);
    
    // Fiyat aralığı
    @Query("SELECT p FROM Product p WHERE p.isActive = true AND p.isDeleted = false AND " +
           "p.price BETWEEN :minPrice AND :maxPrice")
    Page<Product> filterByPriceRange(@Param("minPrice") BigDecimal minPrice, 
                                      @Param("maxPrice") BigDecimal maxPrice, 
                                      Pageable pageable);
}