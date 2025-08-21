package com.devsuperior.dscommerce.dto;

import com.devsuperior.dscommerce.entities.Category;
import com.devsuperior.dscommerce.entities.Product;

import javax.validation.constraints.NotEmpty;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

public class ProductMinDTO {

    private Long id;
    private String name;
    private Double price;
    private String imgUrl;
    private String barCode;
    private Integer quantity;
    private LocalDate dateBuy;
    private LocalDate dueDate;


    @NotEmpty(message = "Deve ter pelo menos uma categoria")
    private List<CategoryDTO> categories = new ArrayList<>();

    public ProductMinDTO() {

    }

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
    public ProductMinDTO(Product entity, Set<Category> categories) {
        this(entity); /*chama o construtor que tem só  a entidade produto
        e todos os atributos dele*/
        categories.forEach(cat -> this.categories.add(new CategoryDTO(cat)));
        /*para cada categoria do argumento, pegamos a categoria do atributo dessa classe e criamos um novo dto
         * para categoria */
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

    public Integer getQuantity() {
        return quantity;
    }

    public List<CategoryDTO> getCategories() {
        return categories;
    }

    public String getImgUrl() {
        return imgUrl;
    }

    public String getBarCode ()  {return barCode;}

    public LocalDate getDateBuy () { return dateBuy;}

    public LocalDate getDueDate () { return dueDate;}

    public Integer quantity() {return quantity;}
}
