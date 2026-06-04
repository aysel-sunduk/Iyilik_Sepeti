package com.donatecommerce.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserBadgeDto {
    private UUID id;
    private UUID badgeId;
    private String name;
    private String description;
    private String iconUrl;
    private LocalDateTime earnedAt;
}
