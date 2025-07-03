package com.devsuperior.dscommerce.services;

import com.devsuperior.dscommerce.dto.*;
import com.devsuperior.dscommerce.entities.*;
import com.devsuperior.dscommerce.repositories.RoleRepository;
import com.devsuperior.dscommerce.services.exceptions.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.devsuperior.dscommerce.repositories.UserRepository;

import javax.persistence.EntityNotFoundException;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class UserService implements UserDetailsService {

	@Autowired
	private UserRepository repository;

	@Autowired
	private RoleRepository roleRepository; // Inject RoleRepository

	@Autowired
	private PasswordEncoder passwordEncoder;

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		
		User user = repository.findByEmail(username);
		if (user == null) {
			throw new UsernameNotFoundException("Email not found");
		}
		return user;
	}
	
	protected User authenticated() {
		try {
			String username = SecurityContextHolder.getContext().getAuthentication().getName();
			return repository.findByEmail(username);
		}
		catch (Exception e) {
			throw new UsernameNotFoundException("Invalid user");
		}
	}

	@Transactional(readOnly = true)
	public UserDTO findById(Long id) {
		User user = repository.findById(id).orElseThrow(
				() -> new ResourceNotFoundException("Recurso não encontrado"));
		return new UserDTO(user);
	}

	@Transactional(readOnly = true)
	public UserDTO getMe() {
		User entity = authenticated();
		return new UserDTO(entity);
	}

	@Transactional
	public UserDTO insertUser(UserDTO dto) {
		User entity = new User();
		copyDtoToEntity(dto, entity);
		entity = repository.save(entity);
		return  new UserDTO(entity);
	}

	@Transactional
	public RoleDTO insertRole(RoleDTO dto) {
		Role entity = new Role();
		entity.setAuthority(dto.getAuthority());
		entity = roleRepository.save(entity);
		return new RoleDTO(entity);
	}

	@Transactional
	public UserDTO update(Long id, UserDTO dto) {
		try {
			User entity = repository.getReferenceById(id);
			copyDtoToEntity(dto, entity);
			entity = repository.save(entity);
			return new UserDTO(entity);
		}
		catch (EntityNotFoundException e) {
			throw new ResourceNotFoundException("Recurso não encontrado");
		}
	}


	@Transactional
	public UserDTO addRoleToUser(Long userId, Long roleId) {
		User user = repository.findById(userId)
				.orElseThrow(() -> new ResourceNotFoundException("User not found"));
		Role role = roleRepository.findById(roleId)
				.orElseThrow(() -> new ResourceNotFoundException("Role not found"));

		user.getRoles().add(role);
		user = repository.save(user);
		return new UserDTO(user);
	}

	private void copyDtoToEntity(UserDTO dto, User entity) {
		entity.setName(dto.getName());
		entity.setEmail(dto.getEmail());
		entity.setPhone(dto.getPhone());
		entity.setPassword(dto.getPassword());
		entity.setBirthDate(dto.getBirthDate());


		// **Criptografa a senha antes de setar na entidade**
		if (dto.getPassword() != null && !dto.getPassword().isEmpty()) {
			entity.setPassword(passwordEncoder.encode(dto.getPassword()));
		}

		// Limpa as roles existentes para garantir que apenas as novas sejam adicionadas
		entity.getRoles().clear();

		// Itera sobre as roles do DTO para buscar e adicionar as roles à entidade
		for (RoleDTO roleDto : dto.getRoles()) {
			Role role = roleRepository.findByAuthority(roleDto.getAuthority())
					.orElseThrow(() -> new ResourceNotFoundException("Role com ID " + roleDto.getId() + " não encontrada."));
			entity.getRoles().add(role);
		}
	}

}
