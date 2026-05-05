package com.donatecommerce.service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.donatecommerce.dto.request.CreateCardRequest;
import com.donatecommerce.dto.response.CardResponse;
import com.donatecommerce.entity.PaymentCard;
import com.donatecommerce.entity.User;
import com.donatecommerce.exception.ResourceNotFoundException;
import com.donatecommerce.repository.PaymentCardRepository;
import com.donatecommerce.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PaymentCardService {
    
    private final PaymentCardRepository cardRepository;
    private final UserRepository userRepository;
    
    public List<CardResponse> getMyCards(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Kullanıcı bulunamadı"));
        
        return cardRepository.findByUserIdAndIsDeletedFalseOrderByIsDefaultDescCreatedAtDesc(user.getId())
                .stream()
                .map(this::mapToCardResponse)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public CardResponse addCard(CreateCardRequest request, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Kullanıcı bulunamadı"));
        
        if (request.getIsDefault() != null && request.getIsDefault()) {
            cardRepository.removeDefaultCard(user.getId());
        }
        
        // In a real app, you'd call a payment provider (Iyzico, Stripe) to get a token
        String lastFour = request.getCardNumber().substring(request.getCardNumber().length() - 4);
        String mockToken = "tok_" + UUID.randomUUID().toString().substring(0, 8);
        
        PaymentCard card = PaymentCard.builder()
                .user(user)
                .cardHolderName(request.getCardHolderName())
                .cardNumberLastFour(lastFour)
                .cardAlias(request.getCardAlias())
                .expiryMonth(request.getExpiryMonth())
                .expiryYear(request.getExpiryYear())
                .cardToken(mockToken)
                .isDefault(request.getIsDefault() != null ? request.getIsDefault() : false)
                .isDeleted(false)
                .build();
        
        card = cardRepository.save(card);
        return mapToCardResponse(card);
    }
    
    @Transactional
    public void deleteCard(UUID cardId, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Kullanıcı bulunamadı"));
        
        PaymentCard card = cardRepository.findByIdAndUserIdAndIsDeletedFalse(cardId, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Kart bulunamadı"));
        
        card.setIsDeleted(true);
        cardRepository.save(card);
    }
    
    private CardResponse mapToCardResponse(PaymentCard card) {
        CardResponse response = new CardResponse();
        response.setId(card.getId());
        response.setCardHolderName(card.getCardHolderName());
        response.setCardNumberLastFour(card.getCardNumberLastFour());
        response.setCardAlias(card.getCardAlias());
        response.setExpiryMonth(card.getExpiryMonth());
        response.setExpiryYear(card.getExpiryYear());
        response.setIsDefault(card.getIsDefault());
        return response;
    }
}
