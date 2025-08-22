package com.devsuperior.dscommerce.services;

import javax.persistence.EntityNotFoundException;

import com.devsuperior.dscommerce.entities.OrderItem;
import com.devsuperior.dscommerce.projections.ProductProjection;
import com.devsuperior.dscommerce.repositories.ProductRepository;
import com.devsuperior.dscommerce.utils.Utils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.devsuperior.dscommerce.dto.CategoryDTO;
import com.devsuperior.dscommerce.dto.ProductDTO;
import com.devsuperior.dscommerce.dto.ProductMinDTO;
import com.devsuperior.dscommerce.entities.Category;
import com.devsuperior.dscommerce.entities.Product;
import com.devsuperior.dscommerce.services.exceptions.DatabaseException;
import com.devsuperior.dscommerce.services.exceptions.ResourceNotFoundException;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ProductService {

    @Autowired
    private ProductRepository repository;

    @Transactional(readOnly = true)
    public ProductDTO findById(Long id) {
        Product product = repository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Recurso não encontrado"));
        return new ProductDTO(product);
    }


    @Transactional(readOnly = true)
    public Page<ProductMinDTO> findByBarCode(String barCode, Pageable pageable) {
        Page<Product> result   = repository.searchByBarcode(barCode, pageable);
        return result.map(p -> new ProductMinDTO(p));
    }


    @SuppressWarnings("unchecked")
    @Transactional(readOnly = true)
    public Page<ProductMinDTO> findAllPaged(String name, String categoryId, Pageable pageable) {


        /*criando vetor de string divindo posição por  ,*/
        //String[] vetString = categoryId.split(",");
        /*Transformando vetor de string em lista de cateegoryId formato String*/
        List<Long> categoryIds = Arrays.asList();
        /*VALIDA se a lista de string está vazia se n tiver
         * vazia 0, então tem algo nela ai posso fazer a conversão em lista
         * de cateegoryId long */
        if(!"0".equals(categoryId)) {
            /*Transformando a Lista de string em lista de Long*/
            categoryIds = Arrays.asList(categoryId.split(",")).stream().map(x -> Long.parseLong(x)).toList();
        /*parse Long.parseLong transforma transforma
        * o elemento de string para long, é possível fazer
        * a expressão lambada dentro do map que resume a conversão
        *  Long::parseLong  tb funciona
        *
        *é possível resumir o arrays . as list dessa forma
  List<Long> categoryIds = Arrays.asList.stream().map(Long::parseLong).toList();
  * e também quiser eliminar a linha do vetor é possível fazer assim
  *
  List<Long> categoryIds = Arrays.asList(categoryId.split(",")).stream().map(Long::parseLong).toList();
         */
        }
        int pageNumber = 0; // primeira página
        int pageSize = 10;  // número de registros por página
        Pageable pageImpl = PageRequest.of(pageNumber, pageSize);

            Page<ProductProjection> page = repository.searchProduct(categoryIds, name, pageImpl);
        List<Long> productIds = page.map(x -> x.getId()).stream().toList(); /*vamos pegar os ids do produtos da
        consulta searchProduct*/

        /*buscando lista de produtos com categorias, passando a lista de productsIds que encontramos
         * na página na primeira consulta*/
        List<Product> entities = repository.searchProductWithCategories(productIds);

        /*o resultado da consulta acima está desornado
         * com a Utils.replace abaixo estamos gerando uma nova lista enties ordenada
         * baseada na ordernadação da página page.getContent( que o usuário colocou*/
        entities = (List<Product>) Utils.replace(page.getContent(), entities); /*Vamos gerar nova lista
        aproveitando o que tinha na pagina com replace, e */
        /*convertendo a lista de produtos acima em lista de productDTO*/

        List<ProductMinDTO> dtos = entities.stream().map(x -> new ProductMinDTO(x, x.getCategories())).toList();

        /*Gerando uma pagina de product DTO*/

        Page<ProductMinDTO> pageDTO = new PageImpl<>(dtos, page.getPageable(), page.getTotalElements());
        /*PageImpl (instancia um novo pageable) */

        return pageDTO;
    }



    @Transactional
    public ProductDTO insert(ProductDTO dto) {
        Product entity = new Product();
        copyDtoToEntity(dto, entity);
        entity = repository.save(entity);
        return new ProductDTO(entity);
    }

    @Transactional
    public ProductDTO update(Long id, ProductDTO dto) {
        try {
            Product entity = repository.getReferenceById(id);
            copyDtoToEntity(dto, entity);
            entity = repository.save(entity);
            return new ProductDTO(entity);
        }
        catch (EntityNotFoundException e) {
            throw new ResourceNotFoundException("Recurso não encontrado");
        }
    }


    @Transactional(propagation = Propagation.REQUIRED)
    public void delete(Long id) {
        try {
            Product product = repository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Recurso não encontrado"));

            // Desassociar OrderItems do produto
            for (OrderItem item : product.getItems()) {
                item.setProduct(null); // Remove a referência ao produto
            }

            // Agora exclua o produto
            repository.delete(product);

        } catch (EmptyResultDataAccessException e) {
            throw new ResourceNotFoundException("Recurso não encontrado");
        } catch (DataIntegrityViolationException e) {
            throw new DatabaseException("Falha de integridade referencial");
        }
    }

    private void copyDtoToEntity(ProductDTO dto, Product entity) {
        entity.setName(dto.getName());
        entity.setDescription(dto.getDescription());
        entity.setPrice(dto.getPrice());
        entity.setImgUrl(dto.getImgUrl());
        entity.setBarCode(dto.getBarCode());
        entity.setDateBuy(dto.getDateBuy());
        entity.setDueDate(dto.getDueDate());
        entity.setQuantity(dto.getQuantity());

        entity.getCategories().clear();
        for (CategoryDTO catDto : dto.getCategories()) {
            Category cat = new Category();
            cat.setId(catDto.getId());
            entity.getCategories().add(cat);
        }
    }
}