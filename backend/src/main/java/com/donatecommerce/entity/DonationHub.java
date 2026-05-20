package com.donatecommerce.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "donation_hubs")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DonationHub {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private String type; // HUB, EVENT, SHELTER

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    private String address;

    @Column(columnDefinition = "TEXT")
    private String imageUrl;

    private boolean isActive;

    private LocalDateTime createdAt;
}
