package com.devsuperior.dscommerce.controllers;

import com.devsuperior.dscommerce.dto.RoleDTO;
import com.devsuperior.dscommerce.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;


@RestController
@RequestMapping("/roles")
public class RoleController {

        @Autowired
        private UserService userService;

        @PostMapping
        public ResponseEntity<RoleDTO> insert(@RequestBody RoleDTO dto) {
            dto = userService.insertRole(dto);
            return ResponseEntity.created(URI.create("/roles/" + dto.getId())).body(dto);
        }
    }
