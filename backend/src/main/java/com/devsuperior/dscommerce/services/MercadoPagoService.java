package com.devsuperior.dscommerce.services;


import com.devsuperior.dscommerce.dto.MercadoPagoNotificationsDTO;
import com.devsuperior.dscommerce.dto.OrderItemPixDTO;
import com.devsuperior.dscommerce.dto.OrderItemPixRequestDTO;
import com.devsuperior.dscommerce.entities.MercadoPagoNotifications;
import com.devsuperior.dscommerce.repositories.MercadoPagoRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Mono;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class MercadoPagoService {

    @Autowired
    private MercadoPagoRepository repository;

    @Autowired
    private WebClient webClient;

    @Autowired
    private MercadoPagoAuthService mercadoPagoAuthService;

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    @Value("${mercado-pago.user-id}")
    private String userId;

    @Value("${mercado-pago.external-pos-id}")
    private String externalPosId;

    private static final Logger logger = LoggerFactory.getLogger(MercadoPagoService.class);

    @Autowired
    private ObjectMapper objectMapper;

    public Mono<Map<String, Object>> createQrCode(OrderItemPixRequestDTO dto) {

        return mercadoPagoAuthService.getAccessToken()
                .flatMap(token -> {

                    //Calculo do total com base no subTotal do pedido

                    Double totalAmount = dto.getOrders().stream().mapToDouble(OrderItemPixDTO::getSubTotal)
                            .sum();

                    // Payload para request ao mercado pago
                    List<Map<String, Object>> orderItems = dto.getOrders().stream().map(
                            x -> {
                                Map<String, Object> item = new HashMap<>();
                                item.put("title", x.getTitle());
                                item.put("unit_price", x.getPrice());
                                item.put("quantity", x.getQuantity());
                                item.put("total_amount", x.getSubTotal());
                                item.put("unit_measure", "unit");
                            return item;
                            }).toList();

                    Map<String, Object> payload = new HashMap<>();
                    payload.put("external_reference", dto.getOrderId());
                    payload.put("title", dto.getTitle());
                    payload.put("description", dto.getDescription());
                    payload.put("total_amount", totalAmount);
                    payload.put("items", orderItems);



                    String url = "/instore/orders/qr/seller/collectors/{userId}/pos/{externalPosId}/qrs";

                    return webClient.post()
                            .uri(url, userId, externalPosId)
                            .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
                            .contentType(MediaType.APPLICATION_JSON)
                            .bodyValue(payload)
                            .retrieve()
                            .bodyToMono(Map.class)
                            .map(response -> {
                                String qrData = (String) response.get("qr_data"); // qr_data é string
                                return Map.of(
                                        "qr_code_string", qrData,
                                        "order_id", response.get("in_store_order_id"),
                                        "total_amount", totalAmount
                                );}
                            )
                            .doOnError(WebClientResponseException.class, ex -> {
                        logger.error("Erro na API do Mercado Pago:");
                        logger.error("Status code: {}", ex.getStatusCode());
                        logger.error("Body: {}", ex.getResponseBodyAsString());
                    })
                            .onErrorResume(WebClientResponseException.class, ex -> {
                                // Retorna JSON amigável para o front
                                Map<String, Object> error = Map.of(
                                        "error", "Falha na criação do QR Pix",
                                        "status", ex.getStatusCode().value(),
                                        "message", ex.getResponseBodyAsString()
                                );
                                return Mono.just(error);
                            } );
                });
    }

    @Transactional
    public MercadoPagoNotificationsDTO notify (MercadoPagoNotificationsDTO dto) {

        MercadoPagoNotifications entity = new MercadoPagoNotifications();

        entity.setResourceId(dto.getResourceId());
        entity.setType(dto.getType());
        entity.setAction(dto.getAction());

        entity = repository.save(entity);

        redisTemplate.convertAndSend("mp_notifications", entity);

        return new MercadoPagoNotificationsDTO(entity);

    }

    @Transactional(readOnly = true)
    public List<MercadoPagoNotificationsDTO> findAllNotifications() {

         List<MercadoPagoNotifications> entity  = repository.findAll(Sort.by(Sort.Direction.DESC, "receivedAt"));

        return entity.stream().map(x -> new MercadoPagoNotificationsDTO(x)).toList();
    }

}
