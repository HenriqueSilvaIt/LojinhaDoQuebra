package com.devsuperior.dscommerce.dto;

import com.devsuperior.dscommerce.entities.Role;

public class RoleDTO {

    private Long id;
    private String authority;

    //Construtores

    public RoleDTO(Long id, String authority) {
        this.id = id;
        this.authority = authority;

    }

    public RoleDTO(Role entity) {
        id = entity.getId();
        authority = entity.getAuthority();
    }

    public Long getId() { return id;}

    public String getAuthority() {return authority;}
}
