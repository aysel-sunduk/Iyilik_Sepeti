package com.donatecommerce.controller;

import com.donatecommerce.dto.response.UserBadgeDto;
import com.donatecommerce.service.BadgeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/badges")
@RequiredArgsConstructor
public class BadgeController {

    private final BadgeService badgeService;

    @GetMapping("/my-badges")
    public ResponseEntity<List<UserBadgeDto>> getMyBadges(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(badgeService.getMyBadges(email));
    }
}
