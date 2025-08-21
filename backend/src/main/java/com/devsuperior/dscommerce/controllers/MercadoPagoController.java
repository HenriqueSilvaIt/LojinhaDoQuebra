package com.devsuperior.dscommerce.controllers;

import com.devsuperior.dscommerce.services.MercadoPagoAuthService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.Map;

@RestController
public class MercadoPagoController {
    @Value("${mercado-pago.device-id}")
    private String deviceId;

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

}