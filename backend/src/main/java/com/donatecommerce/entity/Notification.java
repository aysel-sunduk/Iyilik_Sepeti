package com.donatecommerce.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "notifications")
@Getter @Setter
public class Notification {

    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne
    private User user;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String message;

    private String type;

    private UUID relatedId;

    private Boolean isRead;

    private LocalDateTime createdAt = LocalDateTime.now();
}