package com.donatecommerce.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "badges")
@Getter @Setter
public class Badge {

    @Id
    @GeneratedValue
    private UUID id;

    private String name;
    private String description;
    private String iconUrl;
    private String criteria;

    private LocalDateTime createdAt = LocalDateTime.now();
}