package com.devsuperior.dscommerce.entities;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "tb_mp_notifications")
public class MercadoPagoNotifications {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String resourceId;
    private String type;
    private String action;
    private LocalDateTime receivedAt = LocalDateTime.now();

    public MercadoPagoNotifications() {

    }

    public MercadoPagoNotifications(Long id, String resourceId, String type, String action, LocalDateTime receivedAt) {

        this.id = id;
        this.resourceId = resourceId;
        this.type = type;
        this.action = action;
        this.receivedAt = receivedAt;

    }



    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getResourceId() {
        return resourceId;
    }

    public void setResourceId(String resourceId) {
        this.resourceId = resourceId;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public LocalDateTime getReceivedAt() {
        return receivedAt;
    }

    public void setReceivedAt(LocalDateTime receivedAt) {
        this.receivedAt = receivedAt;
    }

    @PrePersist
    public void prePersist() {
        this.receivedAt = LocalDateTime.now();
    }
}

