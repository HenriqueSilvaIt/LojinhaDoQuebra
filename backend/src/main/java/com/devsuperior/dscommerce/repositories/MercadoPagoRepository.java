package com.devsuperior.dscommerce.repositories;

import com.devsuperior.dscommerce.entities.MercadoPagoNotifications;
import com.devsuperior.dscommerce.entities.Product;
import com.devsuperior.dscommerce.projections.ProductProjection;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface MercadoPagoRepository extends JpaRepository<MercadoPagoNotifications, Long> {



}
