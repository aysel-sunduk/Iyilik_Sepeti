package com.donatecommerce.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "favorites")
@Getter @Setter
public class Favorite {

    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne
    private User user;

    private String entityType; // campaign / product
    private UUID entityId;

    private LocalDateTime createdAt = LocalDateTime.now();
}