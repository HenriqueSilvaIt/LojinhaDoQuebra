package com.devsuperior.dscommerce.controllers;

import com.devsuperior.dscommerce.dto.MercadoPagoNotificationsDTO;
import com.devsuperior.dscommerce.dto.OrderItemPixDTO;
import com.devsuperior.dscommerce.dto.OrderItemPixRequestDTO;
import com.devsuperior.dscommerce.services.MercadoPagoAuthService;
import com.devsuperior.dscommerce.services.MercadoPagoService;
import org.apache.coyote.Response;
import org.aspectj.weaver.ast.Or;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
public class MercadoPagoController {
    @Value("${mercado-pago.device-id}")
    private String deviceId;


    @Autowired
    private MercadoPagoService service;

    private final WebClient webClient;
    private final MercadoPagoAuthService authService;

    public MercadoPagoController(WebClient.Builder webClientBuilder, MercadoPagoAuthService authService) {
        this.webClient = webClientBuilder.baseUrl("https://api.mercadopago.com").build();
        this.authService = authService;
    }
    private static final Logger logger = LoggerFactory.getLogger(MercadoPagoController.class);

    @PostMapping("/mercado-pago-payment")
    public Mono<Map> mercadoPagoPayment(@RequestBody Map<String, Object> paymentData) {
        logger.info("Dados do pagamento recebidos: {}", paymentData);

        return authService.getAccessToken()
                .flatMap(accessToken -> {
                    logger.info("accessToken obtido: {}", accessToken);
                    return webClient.post()
                            .uri("/point/integration-api/devices/{deviceId}/payment-intents", deviceId)
                            .header(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken)
                            .contentType(MediaType.APPLICATION_JSON)
                            .body(BodyInserters.fromValue(paymentData))
                            .retrieve()
                            .bodyToMono(Map.class)
                            .doOnSuccess(response -> logger.info("Resposta da API do Mercado Pago: {}", response))
                            .doOnError(error -> logger.error("Erro na requisição para a API do Mercado Pago: {}", error));
                });
    }

    @GetMapping("/mercado-pago-payment-status/{paymentintentid}")
    public Mono<Map> getPaymentStatus(@PathVariable String paymentintentid) {
        logger.info("Obtendo status do pagamento para paymentintentid: {}", paymentintentid);

        return authService.getAccessToken()
                .flatMap(accessToken -> {
                    logger.info("accessToken obtido: {}", accessToken);
                    return webClient.get()
                            .uri("/point/integration-api/payment-intents/{paymentintentid}", paymentintentid)
                            .header(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken)
                            .retrieve()
                            .bodyToMono(Map.class)
                            .doOnSuccess(response -> logger.info("Resposta da API do Mercado Pago: {}", response))
                            .doOnError(error -> logger.error("Erro na requisição para a API do Mercado Pago: {}", error));
                });
    }

    // Receber notificações webhook
    @PostMapping("/mercadopago-webhook")
    public ResponseEntity<String> handleWebhook(@RequestBody Map<String, Object> payload) {


        // extrai os campos manualmente
        Map<String,Object> data = (Map<String,Object>) payload.get("data");
        String resourceId = data != null ? data.get("id").toString() : null;
        String type = (String) payload.get("type");
        String action = (String) payload.get("action");

        MercadoPagoNotificationsDTO dto = new MercadoPagoNotificationsDTO(resourceId, type, action, LocalDateTime.now());
        System.out.println("Recebi notificação: " + dto);

        service.notify(dto);
        // Processar o status do pagamento
        // Ex: payload.get("id") ou payload.get("type") → consultar status da order via API

        return ResponseEntity.ok("OK");
    }


    @GetMapping(value = "/mercadopago-notifications")
    public ResponseEntity<List<MercadoPagoNotificationsDTO>> findAll() {

        List<MercadoPagoNotificationsDTO> dtoList = service.findAllNotifications();

        return ResponseEntity.ok().body(dtoList);


    }

    @PostMapping(value = "/mercadopago-qrcode")
    public Mono<Map<String, Object>> createQrCodePix(
            @RequestBody OrderItemPixRequestDTO dto) {


        return service.createQrCode(dto);

    }



}