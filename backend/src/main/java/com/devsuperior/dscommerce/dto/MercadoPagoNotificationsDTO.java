package com.devsuperior.dscommerce.dto;

import com.devsuperior.dscommerce.entities.MercadoPagoNotifications;

import java.time.LocalDateTime;

public class MercadoPagoNotificationsDTO {

    private String resourceId;
    private String type;
    private String action;
    private LocalDateTime receivedAt;

    public MercadoPagoNotificationsDTO() {

    }

    public MercadoPagoNotificationsDTO(String resourceId, String type, String action, LocalDateTime receivedAt) {
        this.resourceId = resourceId;
        this.type = type;
        this.action = action;
        this.receivedAt = receivedAt;
    }

    public MercadoPagoNotificationsDTO(MercadoPagoNotifications entity) {
        resourceId = entity.getResourceId();
        type = entity.getType();
        action = entity.getAction();
        receivedAt = entity.getReceivedAt();
    }

    public String getResourceId() {
        return resourceId;
    }

    public String getType() {
        return type;
    }

    public String getAction() {
        return action;
    }

    public LocalDateTime getReceivedAt() {
        return receivedAt;
    }
}
