package com.devsuperior.dscommerce.dto;

public class OrderItemPixDTO {


    private String title;
    private Double price;
    private Integer quantity;
    private Double subTotal;

    public  OrderItemPixDTO() {

    }

    public OrderItemPixDTO(String title, Double price, Integer quantity, Double subTotal) {
        this.title = title;
        this.price = price;
        this.quantity = quantity;
        this.subTotal = subTotal;
    }

    public String getTitle() {
        return title;
    }

    public Double getPrice() {
        return price;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public Double getSubTotal() {
        return subTotal;
    }


}
