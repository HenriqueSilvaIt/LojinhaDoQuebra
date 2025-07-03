package com.devsuperior.dscommerce.dto;

import com.devsuperior.dscommerce.entities.Order;
import com.devsuperior.dscommerce.entities.OrderItem;

import javax.validation.constraints.NotEmpty;
import java.time.Instant;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class HistoryDTO {

    private Long orderId;        // Renamed from 'id' for clarity (it's the order's ID)
    private String productName;  // Renamed from 'name'
    private Instant orderMoment;  // Renamed from 'moment'
    private Integer quantity;     // Quantity of this specific product in the order item
    private Long productId;      // ID of the product
    private Double subTotal;     // Subtotal for THIS specific item (quantity * price)

    // Default constructor is good for JPA or manual instantiation
    public HistoryDTO() {
    }

    // This constructor *must* exactly match the types and order of your JPA @Query projection
    public HistoryDTO(Long orderId, String productName, Integer quantity, Instant orderMoment, Long productId, Double subTotal) {
        this.orderId = orderId;
        this.productName = productName;
        this.quantity = quantity;
        this.orderMoment = orderMoment;
        this.productId = productId;
        this.subTotal = subTotal;
    }

    // This constructor is useful if you are manually converting an OrderItem entity to a HistoryDTO
    // in your service layer (e.g., if you fetch OrderItem entities first, then map them).
    // Note: It calculates subTotal for the single item.
    public HistoryDTO(OrderItem entity) {
        this.orderId = entity.getOrder().getId();
        this.productName = entity.getProduct().getName();
        this.orderMoment = entity.getOrder().getMoment();
        this.quantity = entity.getQuantity();
        this.productId = entity.getProduct().getId();
        this.subTotal = entity.getPrice() * entity.getQuantity(); // Calculate subtotal for this item line
    }

    // --- Getters ---
    public Long getOrderId() {
        return orderId;
    }

    public String getProductName() {
        return productName;
    }

    public Instant getOrderMoment() {
        return orderMoment;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public Long getProductId() {
        return productId;
    }

    public Double getSubTotal() {
        return subTotal;
    }

    // Removed the 'items' collection and 'getTotal()' method
    // as they are not relevant when this DTO represents a single item line
    // from the projection query.
}
