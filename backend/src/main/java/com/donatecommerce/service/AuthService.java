package com.donatecommerce.service;

import com.donatecommerce.dto.request.LoginRequest;
import com.donatecommerce.dto.request.LogoutRequest;
import com.donatecommerce.dto.request.RefreshTokenRequest;
import com.donatecommerce.dto.request.RegisterRequest;
import com.donatecommerce.dto.response.LoginResponse;
import com.donatecommerce.dto.response.LogoutResponse;
import com.donatecommerce.dto.response.RegisterResponse;
import com.donatecommerce.dto.response.TokenRefreshResponse;
import com.donatecommerce.entity.Role;
import com.donatecommerce.entity.User;
import com.donatecommerce.mapper.UserMapper;
import com.donatecommerce.repository.RoleRepository;
import com.donatecommerce.repository.UserRepository;
import com.donatecommerce.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class AuthService {
    private static final Pattern PHONE_PATTERN = Pattern.compile("^0\\d{10}$");

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;

    @Transactional
    public RegisterResponse register(RegisterRequest request) {
        String normalizedEmail = normalizeEmail(request.getEmail());

        if (userRepository.existsByEmailIgnoreCase(normalizedEmail)) {
            throw new IllegalArgumentException("Bu e-posta zaten kayitli");
        }

        validatePhoneFormat(request.getPhone());

        Role userRole;
        if (request.getRole() != null && !request.getRole().isBlank()) {
            userRole = roleRepository.findByName(request.getRole())
                    .or(() -> roleRepository.findByName("ROLE_" + request.getRole().toUpperCase()))
                    .orElseGet(this::resolveDefaultRole);
        } else {
            userRole = resolveDefaultRole();
        }

        User user = new User();
        user.setEmail(normalizedEmail);
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setPhone(request.getPhone());
        user.setRole(userRole);
        user.setPhoneVerified(Boolean.FALSE);
        user.setIsActive(Boolean.TRUE);
        user.setIsDeleted(Boolean.FALSE);
        user.setCreatedAt(LocalDateTime.now());

        User savedUser = userRepository.save(user);
        return UserMapper.toRegisterResponse(savedUser);
    }

    @Transactional
    public LoginResponse login(LoginRequest request) {
        String normalizedEmail = normalizeEmail(request.getEmail());

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(normalizedEmail, request.getPassword())
            );
        } catch (AuthenticationException ex) {
            throw new IllegalArgumentException("E-posta veya sifre hatali");
        }

        User user = userRepository.findByEmailIgnoreCase(normalizedEmail)
                .orElseThrow(() -> new IllegalArgumentException("Kullanici bulunamadi"));

        if (!Boolean.TRUE.equals(user.getIsActive()) || Boolean.TRUE.equals(user.getIsDeleted())) {
            throw new IllegalArgumentException("Kullanici hesabi aktif degil");
        }

        String accessToken = jwtTokenProvider.generateAccessToken(user);
        String refreshToken = jwtTokenProvider.generateRefreshToken(user);

        user.setRefreshToken(refreshToken);
        user.setRefreshTokenExpiresAt(LocalDateTime.now().plusSeconds(jwtTokenProvider.getRefreshTokenExpirationMs() / 1000));
        user.setLastLogin(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);

        return UserMapper.toLoginResponse(user, accessToken, refreshToken, jwtTokenProvider.getAccessTokenExpirationMs() / 1000);
    }

    @Transactional
    public TokenRefreshResponse refresh(RefreshTokenRequest request) {
        User user = userRepository.findByRefreshToken(request.getRefreshToken())
                .orElseThrow(() -> new IllegalArgumentException("Gecersiz yenileme tokeni"));

        if (user.getRefreshTokenExpiresAt() == null || user.getRefreshTokenExpiresAt().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Yenileme tokeninin suresi dolmus");
        }

        if (!jwtTokenProvider.validateToken(request.getRefreshToken())) {
            throw new IllegalArgumentException("Yenileme tokeni gecersiz");
        }
        if (!jwtTokenProvider.isRefreshToken(request.getRefreshToken())) {
            throw new IllegalArgumentException("Gonderilen token refresh token degil");
        }

        String newAccessToken = jwtTokenProvider.generateAccessToken(user);
        String newRefreshToken = jwtTokenProvider.generateRefreshToken(user);

        user.setRefreshToken(newRefreshToken);
        user.setRefreshTokenExpiresAt(LocalDateTime.now().plusSeconds(jwtTokenProvider.getRefreshTokenExpirationMs() / 1000));
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);

        return TokenRefreshResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(newRefreshToken)
                .tokenType("Bearer")
                .expiresIn(jwtTokenProvider.getAccessTokenExpirationMs() / 1000)
                .build();
    }

    @Transactional
    public LogoutResponse logout(LogoutRequest request) {
        User user = userRepository.findByRefreshToken(request.getRefreshToken())
                .orElseThrow(() -> new IllegalArgumentException("Gecersiz yenileme tokeni"));

        user.setRefreshToken(null);
        user.setRefreshTokenExpiresAt(null);
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);

        return LogoutResponse.builder()
                .message("Cikis basarili")
                .logoutTime(LocalDateTime.now())
                .build();
    }

    private Role resolveDefaultRole() {
        return roleRepository.findByName("ROLE_USER")
                .or(() -> roleRepository.findByName("USER"))
                .orElseGet(() -> {
                    Role role = new Role();
                    role.setName("ROLE_USER");
                    role.setDescription("Varsayilan kullanici rolu");
                    return roleRepository.save(role);
                });
    }

    private void validatePhoneFormat(String phone) {
        if (phone == null || phone.isBlank()) {
            return;
        }
        if (!PHONE_PATTERN.matcher(phone).matches()) {
            throw new IllegalArgumentException("Telefon numarasi 0 ile baslayan 11 haneli olmali");
        }
    }

    private String normalizeEmail(String email) {
        if (email == null) {
            return null;
        }
        return email.trim().toLowerCase();
    }
}
