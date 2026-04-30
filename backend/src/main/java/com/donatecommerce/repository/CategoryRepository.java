// repository/CategoryRepository.java
package com.donatecommerce.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.donatecommerce.entity.Category;
import com.donatecommerce.entity.CategoryType;

@Repository
public interface CategoryRepository extends JpaRepository<Category, UUID> {
    
    Optional<Category> findByName(String name);
    
    Optional<Category> findByNameSlug(String nameSlug);
    
    List<Category> findByIsActiveTrue();
    
    List<Category> findByTypeAndIsActiveTrue(CategoryType type);
    
    List<Category> findByType(CategoryType type);
    
    @Query("SELECT c FROM Category c WHERE c.isActive = true ORDER BY c.name ASC")
    List<Category> findAllActiveOrdered();
    
    boolean existsByName(String name);
}