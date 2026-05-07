package com.donatecommerce.repository;

import com.donatecommerce.entity.Favorite;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface FavoriteRepository extends JpaRepository<Favorite, UUID> {
    List<Favorite> findByUserIdAndEntityType(UUID userId, String entityType);
    Optional<Favorite> findByUserIdAndEntityTypeAndEntityId(UUID userId, String entityType, UUID entityId);
    boolean existsByUserIdAndEntityTypeAndEntityId(UUID userId, String entityType, UUID entityId);
}
