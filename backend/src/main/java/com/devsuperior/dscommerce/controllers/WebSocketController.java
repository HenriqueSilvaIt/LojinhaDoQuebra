package com.devsuperior.dscommerce.controllers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class WebSocketController {

    private static final Logger logger = LoggerFactory.getLogger(WebSocketController.class);

    private final SimpMessagingTemplate messagingTemplate;

    public WebSocketController(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    public void sendPaymentStatus(String paymentIntentId, String status) {
        String destination = "/topic/payment-status/" + paymentIntentId; // Tópico específico para cada paymentIntentId
        String message = String.format("{\"paymentIntentId\": \"%s\", \"status\": \"%s\"}", paymentIntentId, status);
        logger.info("Enviando status via WebSocket para {}: {}", destination, message);
        messagingTemplate.convertAndSend(destination, message);
    }
}