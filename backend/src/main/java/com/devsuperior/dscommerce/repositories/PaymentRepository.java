
package com.devsuperior.dscommerce.repositories;

import com.devsuperior.dscommerce.entities.Payment;
import com.devsuperior.dscommerce.entities.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

}
