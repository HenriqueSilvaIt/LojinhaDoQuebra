package com.devsuperior.dscommerce.repositories;

import com.devsuperior.dscommerce.dto.HistoryDTO;
import com.devsuperior.dscommerce.dto.OrderDTO;
import com.devsuperior.dscommerce.entities.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import javax.persistence.*;
import java.time.Instant;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {


    @Query("SELECT new com.devsuperior.dscommerce.dto.HistoryDTO(" +
            "o.id, " +
            "p.name, " +
            "oi.quantity, " +
            "o.moment, " +
            "p.id,  " +
            "oi.quantity * oi.price) " +
            "FROM OrderItem oi " +
            "JOIN  oi.id.order o   " +
            "JOIN oi.id.product p   " +
            "WHERE o.moment >= :minDate AND o.moment < :maxDate " +
            "ORDER BY o.moment DESC " )
    Page<HistoryDTO> searchOrderByDate(Instant minDate, Instant maxDate, Pageable pageable);

    @Query("SELECT SUM(oi.price * oi.quantity) " +
           "FROM OrderItem oi " +
            " JOIN oi.id.order o  " +
            "WHERE o.moment >= :minDate AND o.moment < :maxDate")
    Double calculateTotalAmountByDate(Instant minDate, Instant maxDate);

}