package com.devsuperior.dscommerce.dto;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;
import javax.validation.constraints.Size;

import com.devsuperior.dscommerce.entities.Category;
import com.devsuperior.dscommerce.entities.Product;

public class ProductDTO {

    private Long id;
    @Size(min = 3, max = 80, message = "Nome precisar ter de 3 a 80 caracteres")
    @NotBlank(message = "Campo requerido")
    private String name;
    @Size(min = 10, message = "Descrição precisa ter no mínimo 10 caracteres")
    @NotBlank(message = "Campo requerido")
    private String description;
    @NotNull(message = "Campo requerido")
    @Positive(message = "O preço deve ser positivo")
    private Double price;
    private String imgUrl;
    private String barCode;
    private LocalDate dateBuy;
    private LocalDate dueDate;
    private Integer quantity;

    @NotEmpty(message = "Deve ter pelo menos uma categoria")
    private List<CategoryDTO> categories = new ArrayList<>();

    public ProductDTO () {

    }

    public ProductDTO(Long id, String name, String description, Double price, String imgUrl, String barCode, LocalDate dateBuy, LocalDate dueDate, Integer quantity) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.imgUrl = imgUrl;
        this.barCode = barCode;
        this.dateBuy = dateBuy;
        this.dueDate = dueDate;
        this.quantity = quantity;
    }

    public ProductDTO(Product entity) {
        id = entity.getId();
        name = entity.getName();
        description = entity.getDescription();
        price = entity.getPrice();
        imgUrl = entity.getImgUrl();
        barCode = entity.getBarCode();
        dateBuy = entity.getDateBuy();
        dueDate = entity.getDueDate();
        quantity = entity.getQuantity();

        for (Category cat : entity.getCategories()) {
        	categories.add(new CategoryDTO(cat));
        }
    }

    public ProductDTO(Product entity, Set<Category> categories) {
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

    public String getDescription() {
        return description;
    }

    public Double getPrice() {
        return price;
    }

    public String getImgUrl() {
        return imgUrl;
    }

    public String getBarCode() {return barCode;}

    public Integer getQuantity() {return quantity;}

    public LocalDate getDateBuy() {return dateBuy;}

    public LocalDate getDueDate() {return dueDate;}

	public List<CategoryDTO> getCategories() {
		return categories;
	}
}
