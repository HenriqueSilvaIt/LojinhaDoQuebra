package com.devsuperior.dscommerce.services;

import java.time.*;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.time.temporal.WeekFields;
import java.util.List;
import java.util.Locale;


import com.devsuperior.dscommerce.dto.HistoryDTO;
import com.devsuperior.dscommerce.dto.HistoryPageDTO;
import com.devsuperior.dscommerce.entities.*;
import com.devsuperior.dscommerce.services.exceptions.DatabaseException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.devsuperior.dscommerce.dto.OrderDTO;
import com.devsuperior.dscommerce.dto.OrderItemDTO;
import com.devsuperior.dscommerce.repositories.OrderItemRepository;
import com.devsuperior.dscommerce.repositories.OrderRepository;
import com.devsuperior.dscommerce.repositories.ProductRepository;
import com.devsuperior.dscommerce.services.exceptions.ResourceNotFoundException;

@Service
public class OrderService {

    // --- Ensure DEFAULT_ZONE_ID is declared here, as a class member ---
    private final ZoneId DEFAULT_ZONE_ID = ZoneId.of("America/Sao_Paulo");
    // --- And DATE_FORMATTER as well ---
    private final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ISO_LOCAL_DATE;


    @Autowired
    private OrderRepository repository;
    
    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private OrderItemRepository orderItemRepository;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private AuthService authService;

    @Transactional(readOnly = true)
    public OrderDTO findById(Long id) {
        Order order = repository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Recurso não encontrado"));
        authService.validateSelfOrAdmin(order.getClient().getId());
        return new OrderDTO(order);
    }

    @Transactional(readOnly = true)
    public HistoryPageDTO  findAll(String minDateStr, String maxDateStr, Pageable pageable) {

        DateTimeFormatter formatter = DateTimeFormatter.ISO_LOCAL_DATE;
        ZoneId systemDefaultZone = ZoneId.systemDefault(); // Cache ZoneId for performance and clarity

        LocalDate parsedMinDate;
        LocalDate parsedMaxDate;

        // --- Handle minDateStr ---
        if (minDateStr != null && !minDateStr.isEmpty()) {
            try {
                parsedMinDate = LocalDate.parse(minDateStr, formatter);
            } catch (DateTimeParseException e) {
                System.err.println("Error parsing minDate: " + e.getMessage()); // Use System.err for errors
                parsedMinDate = LocalDate.of(1900, 1, 1); // Very old date as a robust fallback
            }
        } else {
            parsedMinDate = LocalDate.of(1900, 1, 1); // Default to a very old date if no minDate provided
        }

        // --- Handle maxDateStr ---
        if (maxDateStr != null && !maxDateStr.isEmpty()) {
            try {
                parsedMaxDate = LocalDate.parse(maxDateStr, formatter);
            } catch (DateTimeParseException e) {
                System.err.println("Error parsing maxDate: " + e.getMessage());
                parsedMaxDate = LocalDate.of(2100, 12, 31); // Very far date as a robust fallback
            }
        } else {
            parsedMaxDate = LocalDate.of(2100, 12, 31); // Default to a very far date if no maxDate provided
        }


// Correct Conversion to Instant for Range Query using UTC
// This ensures the Instant values are strictly UTC, regardless of JVM's default timezone.
        Instant minInstant = parsedMinDate.atStartOfDay(ZoneOffset.UTC).toInstant();

// maxInstant: Start of the day *after* the maximum date (making the range exclusive of the next day)
// Still converting the Local Date of the *next* day to its UTC start.
        Instant maxInstant = parsedMaxDate.plusDays(1).atStartOfDay(ZoneOffset.UTC).toInstant();

// Log for debugging:
        System.out.println("Backend received minDateStr: " + minDateStr + ", maxDateStr: " + maxDateStr);
        System.out.println("Parsed minDate (LocalDate): " + parsedMinDate + ", maxDate (LocalDate): " + parsedMaxDate);
        System.out.println("Converted minInstant (UTC): " + minInstant + ", maxInstant (UTC): " + maxInstant); // Should now see 00:00:00Z
        // Log for debugging:
        System.out.println("Backend received minDateStr: " + minDateStr + ", maxDateStr: " + maxDateStr);
        System.out.println("Parsed minDate (LocalDate): " + parsedMinDate + ", maxDate (LocalDate): " + parsedMaxDate);
        System.out.println("Converted minInstant: " + minInstant + ", maxInstant: " + maxInstant);



        // 1. Busque a página de HistoryDTOs (como você já faz)
        Page<HistoryDTO> historyPage = repository.searchOrderByDate(
                minInstant,
                maxInstant,
                pageable);

        // 2. Calcule o valor total para o período (sem paginação)
        Double totalAmount = repository.calculateTotalAmountByDate(minInstant, maxInstant);
        // Se o total for null (nenhum item), defina como 0.0
        if (totalAmount == null) {
            totalAmount = 0.0;
        }

        // 3. Retorne o novo DTO que contém a página e o total


        return  new HistoryPageDTO(historyPage, totalAmount);
    }


    @Transactional
	public OrderDTO insert(OrderDTO dto) {
		
    	Order order = new Order();
    	
    	order.setMoment(Instant.now());
    	order.setStatus(OrderStatus.WAITING_PAYMENT);
    	
    	User user = userService.authenticated();
    	order.setClient(user);
    	
    	for (OrderItemDTO itemDto : dto.getItems()) {
    		Product product = productRepository.getReferenceById(itemDto.getProductId());
    		OrderItem item = new OrderItem(order, product, itemDto.getQuantity(), product.getPrice());
    		order.getItems().add(item);
    	}
    	
    	repository.save(order);
    	orderItemRepository.saveAll(order.getItems());
    	
    	return new OrderDTO(order);
	}

    @Transactional(propagation = Propagation.REQUIRED)
    public void deleteOrderItem(Long orderId, Long productId) {
        try {
            System.out.println("Tentando excluir OrderItem com orderId: " + orderId + " e productId: " + productId);

            Order order = repository.findById(orderId).orElseThrow(() -> new ResourceNotFoundException("Pedido não encontrado"));
            Product product = productRepository.findById(productId).orElseThrow(() -> new ResourceNotFoundException("Produto não encontrado"));

            OrderItemPK orderItemPK = new OrderItemPK(order, product);

            System.out.println("OrderItemPK criado: orderId=" + orderItemPK.getOrder().getId() + ", productId=" + orderItemPK.getProduct().getId());

            // Verifique se o OrderItem existe antes de tentar excluí-lo
            if (orderItemRepository.existsById(orderItemPK)) {
                orderItemRepository.deleteById(orderItemPK);
                System.out.println("OrderItem excluído com sucesso.");
            } else {
                System.out.println("OrderItem não encontrado.");
                throw new ResourceNotFoundException("Item do pedido não encontrado");
            }

        } catch (EmptyResultDataAccessException e) {
            System.out.println("OrderItem não encontrado.");
            throw new ResourceNotFoundException("Item do pedido não encontrado");
        } catch (DataIntegrityViolationException e) {
            System.out.println("Falha de integridade referencial.");
            throw new DatabaseException("Falha de integridade referencial");
        }
    }

    @Transactional(propagation = Propagation.REQUIRED) // Alterado para REQUIRED
    public void deleteOrder(Long id) {
        try {
            Order order = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Recurso não encontrado"));

            // Excluir OrderItems associados ao Order
            orderItemRepository.deleteAll(order.getItems());

            // Excluir o Order
            repository.delete(order);
        } catch (EmptyResultDataAccessException e) {
            throw new ResourceNotFoundException("Recurso não encontrado");
        } catch (DataIntegrityViolationException e) {
            throw new DatabaseException("Falha de integridade referencial");
        }
    }
}
