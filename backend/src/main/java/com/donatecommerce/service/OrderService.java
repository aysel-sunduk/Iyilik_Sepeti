package com.donatecommerce.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.donatecommerce.dto.request.CancelOrderRequest;
import com.donatecommerce.dto.request.CreateOrderRequest;
import com.donatecommerce.dto.request.OrderItemRequest;
import com.donatecommerce.dto.response.OrderItemResponse;
import com.donatecommerce.dto.response.OrderResponse;
import com.donatecommerce.entity.Address;
import com.donatecommerce.entity.Order;
import com.donatecommerce.entity.OrderItem;
import com.donatecommerce.entity.OrderStatus;
import com.donatecommerce.entity.Payment;
import com.donatecommerce.entity.Product;
import com.donatecommerce.entity.Refund;
import com.donatecommerce.entity.RefundStatus;
import com.donatecommerce.entity.User;
import com.donatecommerce.exception.AccessDeniedException;
import com.donatecommerce.exception.BadRequestException;
import com.donatecommerce.exception.ResourceNotFoundException;
import com.donatecommerce.repository.AddressRepository;
import com.donatecommerce.repository.OrderItemRepository;
import com.donatecommerce.repository.OrderRepository;
import com.donatecommerce.repository.PaymentRepository;
import com.donatecommerce.repository.ProductRepository;
import com.donatecommerce.repository.RefundRepository;
import com.donatecommerce.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OrderService {
    
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final AddressRepository addressRepository;
    private final ProductRepository productRepository;
    private final PaymentRepository paymentRepository;
    private final RefundRepository refundRepository;
    private final UserRepository userRepository;
    
    @Transactional
    public OrderResponse createOrder(CreateOrderRequest request, String email) {
        User buyer = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Kullanıcı bulunamadı"));
        
        // Adresi kontrol et
        Address shippingAddress = addressRepository.findById(request.getShippingAddressId())
                .orElseThrow(() -> new ResourceNotFoundException("Adres bulunamadı"));
        
        if (!shippingAddress.getUser().getId().equals(buyer.getId())) {
            throw new AccessDeniedException("Bu adres size ait değil");
        }
        
        // GIFT kontrolü
        if ("GIFT".equals(request.getOrderType()) && 
            (request.getReceiverName() == null || request.getReceiverName().isBlank())) {
            throw new BadRequestException("Hediye siparişlerde alıcı adı zorunludur");
        }
        
        // Ürünleri doğrula ve toplam fiyatı hesapla
        BigDecimal totalAmount = BigDecimal.ZERO;
        List<OrderItem> orderItems = new ArrayList<>();
        
        for (OrderItemRequest itemRequest : request.getItems()) {
            Product product = productRepository.findById(itemRequest.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Ürün bulunamadı: " + itemRequest.getProductId()));
            
            if (product.getStock() == null || product.getStock() < itemRequest.getQuantity()) {
                throw new BadRequestException(
                        "Yetersiz stok: " + product.getName() + 
                        " (Mevcut: " + product.getStock() + ")");
            }
            
            BigDecimal subtotal = product.getPrice().multiply(BigDecimal.valueOf(itemRequest.getQuantity()));
            totalAmount = totalAmount.add(subtotal);
            
            OrderItem orderItem = OrderItem.builder()
                    .product(product)
                    .quantity(itemRequest.getQuantity())
                    .unitPrice(product.getPrice())
                    .subtotal(subtotal)
                    .isDonation(false)
                    .build();
            
            orderItems.add(orderItem);
            
            // Stok güncelle
            product.setStock(product.getStock() - itemRequest.getQuantity());
            productRepository.save(product);
        }
        
        // Ödeme kaydı oluştur
        Payment payment = Payment.builder()
                .user(buyer)
                .amount(totalAmount)
                .paymentMethod(request.getPaymentMethod().toLowerCase())
                .transactionId("TRX-" + System.currentTimeMillis())
                .status("pending")
                .build();
        payment = paymentRepository.save(payment);
        
        // Sipariş oluştur
        Order order = Order.builder()
                .buyer(buyer)
                .payment(payment)
                .shippingAddress(shippingAddress)
                .totalAmount(totalAmount)
                .status(OrderStatus.PENDING)
                .isDeleted(false)
                .build();
        
        // Hediye notu ekle
        if ("GIFT".equals(request.getOrderType())) {
            String giftNote = String.format("GIFT|receiver:%s|message:%s",
                    request.getReceiverName(),
                    request.getGiftMessage() != null ? request.getGiftMessage() : "");
            order.setNotes(giftNote);
        }
        
        order = orderRepository.save(order);
        
        // Order items'ları kaydet
        for (OrderItem item : orderItems) {
            item.setOrder(order);
            orderItemRepository.save(item);
        }
        
        // Ödeme başarılı simülasyonu
        payment.setStatus("SUCCESS");
        paymentRepository.save(payment);
        
        return mapToOrderResponse(order);
    }
    
    public List<OrderResponse> getMyOrders(String email, String status) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Kullanıcı bulunamadı"));
        
        List<Order> orders;
        if (status != null && !status.isEmpty()) {
            OrderStatus orderStatus = OrderStatus.valueOf(status.toUpperCase());
            orders = orderRepository.findByBuyerIdAndStatusAndIsDeletedFalseOrderByCreatedAtDesc(
                    user.getId(), orderStatus);
        } else {
            orders = orderRepository.findByBuyerIdAndIsDeletedFalseOrderByCreatedAtDesc(user.getId());
        }
        
        return orders.stream()
                .map(this::mapToOrderResponse)
                .collect(Collectors.toList());
    }
    
    public OrderResponse getOrderDetail(UUID orderId, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Kullanıcı bulunamadı"));
        
        Order order = orderRepository.findByIdAndIsDeletedFalse(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Sipariş bulunamadı"));
        
        if (!order.getBuyer().getId().equals(user.getId())) {
            throw new AccessDeniedException("Bu siparişi görüntüleme yetkiniz yok");
        }
        
        return mapToOrderResponse(order);
    }
    
    @Transactional
    public OrderResponse cancelOrder(UUID orderId, CancelOrderRequest request, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Kullanıcı bulunamadı"));
        
        Order order = orderRepository.findByIdAndIsDeletedFalse(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Sipariş bulunamadı"));
        
        if (!order.getBuyer().getId().equals(user.getId())) {
            throw new AccessDeniedException("Bu siparişi iptal etme yetkiniz yok");
        }
        
        if (order.getStatus() != OrderStatus.PENDING && order.getStatus() != OrderStatus.PROCESSING) {
            throw new BadRequestException(
                    "Bu sipariş iptal edilemez. Mevcut durum: " + order.getStatus().name());
        }
        
        // Stokları geri yükle
        List<OrderItem> items = orderItemRepository.findByOrderId(order.getId());
        for (OrderItem item : items) {
            Product product = item.getProduct();
            product.setStock(product.getStock() + item.getQuantity());
            productRepository.save(product);
        }
        
        // Siparişi iptal et
        order.setStatus(OrderStatus.CANCELLED);
        
        if (request.getReason() != null && !request.getReason().isBlank()) {
            String currentNotes = order.getNotes() != null ? order.getNotes() : "";
            order.setNotes(currentNotes + " | İptal Sebebi: " + request.getReason());
        }
        
        orderRepository.save(order);
        
        // Ödeme iade
        if (order.getPayment() != null) {
            Payment payment = order.getPayment();
            payment.setStatus("refunded");
            paymentRepository.save(payment);
            
            // Refund kaydı
            Refund refund = Refund.builder()
                    .payment(payment)
                    .requestedBy(user)
                    .amount(order.getTotalAmount())
                    .reason(request.getReason() != null ? request.getReason() : "Sipariş iptali")
                    .status(RefundStatus.APPROVED)
                    .processedBy(user)
                    .processedAt(LocalDateTime.now())
                    .build();
            refundRepository.save(refund);
        }
        
        return mapToOrderResponse(order);
    }
    
    private OrderResponse mapToOrderResponse(Order order) {
        OrderResponse response = new OrderResponse();
        response.setId(order.getId());
        response.setBuyerId(order.getBuyer().getId());
        response.setBuyerName(order.getBuyer().getFullName());
        response.setPaymentId(order.getPayment() != null ? order.getPayment().getId() : null);
        response.setPaymentStatus(order.getPayment() != null ? order.getPayment().getStatus() : null);
        response.setShippingAddressId(order.getShippingAddress().getId());
        response.setShippingAddress(formatAddress(order.getShippingAddress()));
        response.setTotalAmount(order.getTotalAmount());
        response.setStatus(order.getStatus().name());
        response.setStatusDescription(getStatusDescription(order.getStatus()));
        response.setShippingCompany(order.getShippingCompany());
        response.setTrackingNumber(order.getTrackingNumber());
        response.setShippedAt(order.getShippedAt());
        response.setDeliveredAt(order.getDeliveredAt());
        response.setCreatedAt(order.getCreatedAt());
        response.setUpdatedAt(order.getUpdatedAt());
        
        // Hediye bilgileri
        if (order.getNotes() != null && order.getNotes().startsWith("GIFT|")) {
            response.setOrderType("GIFT");
            String note = order.getNotes();
            String[] parts = note.split("\\|");
            for (String part : parts) {
                if (part.startsWith("receiver:")) {
                    response.setReceiverName(part.replace("receiver:", ""));
                } else if (part.startsWith("message:")) {
                    response.setGiftMessage(part.replace("message:", ""));
                }
            }
        } else {
            response.setOrderType("PERSONAL");
        }
        
        // Kargo durumu
        response.setShippingStatus(getShippingStatus(order));
        response.setEstimatedDays(calculateEstimatedDays(order));
        
        // Order items
        List<OrderItem> items = orderItemRepository.findByOrderId(order.getId());
        response.setItems(items.stream().map(this::mapToOrderItemResponse).collect(Collectors.toList()));
        
        return response;
    }
    
    private OrderItemResponse mapToOrderItemResponse(OrderItem item) {
        OrderItemResponse itemResponse = new OrderItemResponse();
        itemResponse.setProductId(item.getProduct().getId());
        itemResponse.setProductName(item.getProduct().getName());
        itemResponse.setProductImage(item.getProduct().getImageUrl());
        itemResponse.setQuantity(item.getQuantity());
        itemResponse.setUnitPrice(item.getUnitPrice());
        itemResponse.setSubtotal(item.getSubtotal());
        itemResponse.setIsDonation(item.getIsDonation());
        return itemResponse;
    }
    
    private String formatAddress(Address address) {
        return String.format("%s, %s/%s%s",
                address.getAddressLine(),
                address.getDistrict(),
                address.getCity(),
                address.getPostalCode() != null ? " - " + address.getPostalCode() : "");
    }
    
    private String getStatusDescription(OrderStatus status) {
        return switch (status) {
            case PENDING -> "Ödeme bekleniyor";
            case PROCESSING -> "Hazırlanıyor";
            case SHIPPED -> "Kargoya verildi";
            case DELIVERED -> "Teslim edildi";
            case CANCELLED -> "İptal edildi";
            case RETURNED -> "İade edildi";
        };
    }
    
    private String getShippingStatus(Order order) {
        return switch (order.getStatus()) {
            case PENDING -> "Sipariş alındı, ödeme bekleniyor";
            case PROCESSING -> "Siparişiniz hazırlanıyor";
            case SHIPPED -> order.getShippingCompany() != null
                    ? String.format("Kargoda - %s (Takip No: %s)",
                            order.getShippingCompany(), order.getTrackingNumber())
                    : "Kargoya verildi";
            case DELIVERED -> String.format("Teslim edildi - %s",
                    order.getDeliveredAt() != null
                            ? order.getDeliveredAt().format(DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm"))
                            : "");
            case CANCELLED -> "Sipariş iptal edildi";
            case RETURNED -> "Ürün iade edildi";
        };
    }
    
    private int calculateEstimatedDays(Order order) {
        return switch (order.getStatus()) {
            case DELIVERED, CANCELLED, RETURNED -> 0;
            case SHIPPED -> order.getShippedAt() != null
                    ? Math.max(1, 3 - (int) ChronoUnit.DAYS.between(order.getShippedAt(), LocalDateTime.now()))
                    : 3;
            case PROCESSING -> 3;
            case PENDING -> 5;
        };
    }
}