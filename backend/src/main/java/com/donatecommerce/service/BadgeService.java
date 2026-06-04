package com.donatecommerce.service;

import com.donatecommerce.dto.response.UserBadgeDto;
import com.donatecommerce.entity.Badge;
import com.donatecommerce.entity.OrderItem;
import com.donatecommerce.entity.User;
import com.donatecommerce.entity.UserBadge;
import com.donatecommerce.repository.BadgeRepository;
import com.donatecommerce.repository.UserBadgeRepository;
import com.donatecommerce.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Puan ve Rozet Sistemi:
 *
 * PUAN KAZANMA:
 *   - Her bağış yapılan ürün adedi için → 10 Puan
 *
 * ROZET MİLESTONE'LARI (Puana Göre):
 *   -   50 Puan → 🌱 Tohum Gönüllü     (İlk bağışlarını yapmaya başladın!)
 *   -  100 Puan → 🌟 İyilik Elçisi     (İyilik yayıyorsun!)
 *   -  250 Puan → 🥈 Gümüş Gönüllü    (Harika bir gönüllüsün!)
 *   -  500 Puan → 🥇 Altın Gönüllü    (Altın kalpli birisin!)
 *   - 1000 Puan → 💎 Efsane Gönüllü   (Sen bir efsanesin!)
 *
 * SEVİYE (volunteerLevel):
 *   -    0-49 Puan → Yeni Gönüllü
 *   -   50-249 Puan → Gümüş Gönüllü
 *   -  250-999 Puan → Altın Gönüllü
 *   - 1000+    Puan → Efsane Gönüllü
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class BadgeService {

    private final BadgeRepository badgeRepository;
    private final UserBadgeRepository userBadgeRepository;
    private final UserRepository userRepository;

    // Rozet tanımları: { ad, açıklama, emoji_ikon, gereken_puan }
    private static final Object[][] BADGE_MILESTONES = {
        { "Tohum Gönüllü",   "İlk bağışlarını yapmaya başladın! Tohumun yeşeriyor.",   "🌱",   50 },
        { "İyilik Elçisi",   "İyilik mesajın yayılıyor, sen bir elçisin!",             "🌟",  100 },
        { "Gümüş Gönüllü",  "Harika bir gönüllüsün! Gümüş kalbinle fark yaratıyorsun.", "🥈", 250 },
        { "Altın Gönüllü",  "Altın kalpli birisin! Dünyayı daha güzel yapıyorsun.",    "🥇",  500 },
        { "Efsane Gönüllü", "Sen bir efsanesin! İyiliğin sınır tanımıyor.",             "💎", 1000 },
    };

    // Bağış başına kazanılan puan
    private static final int POINTS_PER_DONATION_ITEM = 10;

    // ── Public API ────────────────────────────────────────────────────

    public List<UserBadgeDto> getMyBadges(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));
        return userBadgeRepository.findByUserId(user.getId())
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public void evaluateBadgesAndPoints(User user, List<OrderItem> orderItems) {
        if (orderItems == null || orderItems.isEmpty()) return;

        // 1. Bu siparişten kaç adet bağış yapıldı?
        int donatedItemCount = orderItems.stream()
                .filter(item -> Boolean.TRUE.equals(item.getIsDonation()))
                .mapToInt(OrderItem::getQuantity)
                .sum();

        if (donatedItemCount == 0) return;

        // 2. Puan ekle (her adet için POINTS_PER_DONATION_ITEM puan)
        int earnedPoints = donatedItemCount * POINTS_PER_DONATION_ITEM;
        int prevPoints   = user.getImpactPoints() != null ? user.getImpactPoints() : 0;
        int newPoints    = prevPoints + earnedPoints;

        user.setImpactPoints(newPoints);
        user.setTotalDonationsCount(
            (user.getTotalDonationsCount() != null ? user.getTotalDonationsCount() : 0) + donatedItemCount
        );

        // 3. Seviye güncelle
        user.setVolunteerLevel(resolveLevel(newPoints));
        userRepository.save(user);

        log.info("Kullanici {} → +{} puan (toplam: {}), seviye: {}",
                user.getEmail(), earnedPoints, newPoints, user.getVolunteerLevel());

        // 4. Milestone rozet kontrolü
        for (Object[] milestone : BADGE_MILESTONES) {
            String badgeName   = (String) milestone[0];
            String badgeDesc   = (String) milestone[1];
            String badgeIcon   = (String) milestone[2];
            int    requiredPts = (int)    milestone[3];

            if (newPoints >= requiredPts) {
                ensureBadgeExists(badgeName, badgeDesc, badgeIcon, requiredPts);
                awardBadgeIfNotEarned(user, badgeName);
            }
        }
    }

    // ── Yardımcı metodlar ────────────────────────────────────────────

    /** Rozet DB'de yoksa oluştur. */
    private void ensureBadgeExists(String name, String description, String iconUrl, int requiredPoints) {
        if (badgeRepository.findByName(name).isEmpty()) {
            Badge badge = new Badge();
            badge.setName(name);
            badge.setDescription(description);
            badge.setIconUrl(iconUrl);
            badge.setCriteria(requiredPoints + " puan");
            badgeRepository.save(badge);
            log.info("Yeni rozet olusturuldu: {}", name);
        }
    }

    /** Kullanıcı bu rozeti almamışsa ver. */
    private void awardBadgeIfNotEarned(User user, String badgeName) {
        Badge badge = badgeRepository.findByName(badgeName).orElse(null);
        if (badge == null) return;
        if (!userBadgeRepository.existsByUserIdAndBadgeId(user.getId(), badge.getId())) {
            UserBadge userBadge = new UserBadge();
            userBadge.setUser(user);
            userBadge.setBadge(badge);
            userBadgeRepository.save(userBadge);
            log.info("Rozet verildi: {} → {}", user.getEmail(), badgeName);
        }
    }

    /** Puana göre seviye adı döner. */
    private String resolveLevel(int points) {
        if (points >= 1000) return "Efsane Gönüllü";
        if (points >= 250)  return "Altın Gönüllü";
        if (points >= 50)   return "Gümüş Gönüllü";
        return "Yeni Gönüllü";
    }

    private UserBadgeDto mapToDto(UserBadge userBadge) {
        Badge badge = userBadge.getBadge();
        return UserBadgeDto.builder()
                .id(userBadge.getId())
                .badgeId(badge.getId())
                .name(badge.getName())
                .description(badge.getDescription())
                .iconUrl(badge.getIconUrl())
                .earnedAt(userBadge.getEarnedAt())
                .build();
    }
}
