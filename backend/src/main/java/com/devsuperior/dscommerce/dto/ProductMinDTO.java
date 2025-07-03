package com.devsuperior.dscommerce.dto;

import com.devsuperior.dscommerce.entities.Product;

import java.time.LocalDate;

public class ProductMinDTO {

    private Long id;
    private String name;
    private Double price;
    private String imgUrl;
    private String barCode;
    private Integer quantity;
    private LocalDate dateBuy;
    private LocalDate dueDate;

    public ProductMinDTO(Long id, String name, Double price, String imgUrl, String barCode, LocalDate dateBuy, LocalDate dueDate, Integer quantity) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.imgUrl = imgUrl;
        this.barCode = barCode;
        this.dateBuy = dateBuy;
        this.dueDate = dueDate;
        this.quantity = quantity;
    }

    public ProductMinDTO(Product entity) {
        id = entity.getId();
        name = entity.getName();
        price = entity.getPrice();
        imgUrl = entity.getImgUrl();
        barCode = entity.getBarCode();
        dateBuy = entity.getDateBuy();
        dueDate = entity.getDueDate();
        quantity = entity.getQuantity();
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public Double getPrice() {
        return price;
    }

    public String getImgUrl() {
        return imgUrl;
    }

    public String getBarCode ()  {return barCode;}

    public LocalDate getDateBuy () { return dateBuy;}

    public LocalDate getDueDate () { return dueDate;}

    public Integer quantity() {return quantity;}
}
