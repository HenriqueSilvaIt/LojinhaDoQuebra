package com.devsuperior.dscommerce.repositories;

import com.devsuperior.dscommerce.entities.Product;
import com.devsuperior.dscommerce.projections.ProductProjection;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {


    /*Consulta para buscar os Ids dos produtos que vão fazer parte da página*/

    @Query(nativeQuery = true, value = """
   SELECT DISTINCT
       tb_product.id,
       tb_product.name,
       tb_product.price,
       tb_product.img_url as imgUrl,
       tb_product.bar_code as barCode,
       tb_product.date_buy as dateBuy,
       tb_product.due_date as dueDate,
       tb_product.quantity
   FROM tb_product
   LEFT JOIN tb_product_category
   ON tb_product.id = tb_product_category.product_id
   WHERE ((:categoryIds) IS NULL OR tb_product_category.category_id IN (:categoryIds))
   AND LOWER(tb_product.name) LIKE LOWER(CONCAT('%', :name, '%'))
   ORDER BY tb_product.name ASC
   """,
            countQuery = """
SELECT COUNT(DISTINCT tb_product.id)
FROM tb_product
LEFT JOIN tb_product_category
ON tb_product.id = tb_product_category.product_id
WHERE ((:categoryIds) IS NULL OR tb_product_category.category_id IN (:categoryIds))
AND LOWER(tb_product.name) LIKE LOWER(CONCAT('%', :name, '%'))
   """)
    Page<ProductProjection> searchProduct(List<Long> categoryIds, String name, Pageable pageble);
    /*normalmente colocamos os nomes dos métodos no repositório
     * começando com search porque os métodos que já vem no jpa
     * repository começando com find e os QueryMethods também*/



    /*Consulta para buscar os produtos com as categorias pegando o id do produto com o
    * resultado da consulta anterior*/


    @Query("SELECT  obj " +
            "FROM Product obj " +
            "JOIN FETCH obj.categories " +
            "WHERE obj.id IN :productIds " +
            "ORDER BY obj.name")/*dentro da classe product
            o nome do atributo da classe categoria é categories
            por isso passamos assim na query*/
    List<Product> searchProductWithCategories(List<Long> productIds);

    @Query("SELECT obj FROM Product obj " +
            "WHERE UPPER(obj.barCode) LIKE UPPER(CONCAT('%', :barCode, '%'))")
    Page<Product> searchByBarcode(String barCode, Pageable pageable);
}
