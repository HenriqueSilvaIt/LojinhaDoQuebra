package com.devsuperior.dscommerce.projections;


import java.math.BigInteger;
import java.time.LocalDate;

public interface ProductProjection extends IdProjection<Long> {

  Long getId();// o get Id dele agora vai para o Id projection


    String getName();
    Double getPrice();
    String getImgUrl();
    String getBarCode();
    LocalDate getDateBuy();
    LocalDate getDueDate();
    Integer getQuantity();
}
