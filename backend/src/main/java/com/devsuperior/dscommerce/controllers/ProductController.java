package com.devsuperior.dscommerce.controllers;

import java.io.IOException;
import java.net.URI;
import java.nio.file.Files;
import java.nio.file.Paths;

import javax.validation.Path;
import javax.validation.Valid;

import com.devsuperior.dscommerce.dto.UserDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.devsuperior.dscommerce.dto.ProductDTO;
import com.devsuperior.dscommerce.dto.ProductMinDTO;
import com.devsuperior.dscommerce.services.ProductService;

@RestController
@RequestMapping(value = "/products")
public class ProductController {


    @Autowired
    private ProductService service;

    @GetMapping(value = "/{id}")
    public ResponseEntity<ProductDTO> findById(@PathVariable Long id) {
        ProductDTO dto = service.findById(id);
        return ResponseEntity.ok(dto);
    }


    @GetMapping(params = "barCode")
    public ResponseEntity<Page<ProductMinDTO>> findByBarCode(
            @RequestParam(name = "barCode", defaultValue = "") String barCode,
            Pageable pageable) {
        Page<ProductMinDTO> dto = service.findByBarCode(barCode, pageable);
        return ResponseEntity.ok(dto);
    }


    @GetMapping
    public ResponseEntity <Page<ProductMinDTO>> findAllPaged(
            @RequestParam(value = "name", defaultValue = "") String name, /*É importante
            colocar o mesmo nome no RequestParam na variavel, e o default value
            é se não informa qual vai ser o valor padrão*/
            @RequestParam(value = "categoryId", defaultValue = "0") String categoryId,
            Pageable pageable) {

        Page<ProductMinDTO> list = service.findAllPaged(name, categoryId, pageable);

        return ResponseEntity.ok().body(list);
        /* .body  é para definir o corpo da resposta você pode colocar
         * o list dentro do ok, porque ele tem uma sobrecarga dentro do ok
         * que aceita o corpo*/

    }

/*

    @GetMapping
    public ResponseEntity<Page<ProductMinDTO>> findByBarcode(
            @RequestParam(name = "barCode", defaultValue = "") String barCode,
            Pageable pageable) {
        Page<ProductMinDTO> dto = service.findByBarcode(barCode, pageable);
        return ResponseEntity.ok(dto);
    }

*/



    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping
    public ResponseEntity<ProductDTO> insert(@Valid @RequestBody ProductDTO dto) {
        dto = service.insert(dto);
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}")
                .buildAndExpand(dto.getId()).toUri();
        return ResponseEntity.created(uri).body(dto);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PutMapping(value = "/{id}")
    public ResponseEntity<ProductDTO> update(@PathVariable Long id, @Valid @RequestBody ProductDTO dto) {
        dto = service.update(id, dto);
        return ResponseEntity.ok(dto);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping(value = "/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }


}