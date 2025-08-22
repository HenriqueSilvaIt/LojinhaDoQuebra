package com.devsuperior.dscommerce.dto;

import java.util.ArrayList;
import java.util.List;

public class OrderItemPixRequestDTO {

    private String orderId;
    private String description;
    private String title;

    List<OrderItemPixDTO> orders = new ArrayList<>();

    public  OrderItemPixRequestDTO() {

    }

    public OrderItemPixRequestDTO(String orderId, String description, String title, List<OrderItemPixDTO> orders) {
        this.orderId = orderId;
        this.description = description;
        this.title = title;
        this.orders = orders;
    }

    public String getOrderId() {
        return orderId;
    }

    public String getDescription() {
        return description;
    }

    public String getTitle() {
        return title;
    }

    public List<OrderItemPixDTO> getOrders() {
        return orders;
    }
}
