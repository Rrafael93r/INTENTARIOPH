package com.pharmaser.bitacora.service;

import com.pharmaser.bitacora.model.Usuarios;
import com.pharmaser.bitacora.repository.UsuariosRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UsuariosService {

    @Autowired
    private UsuariosRepository usuariosRepository;

    @Autowired
    private org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    public Usuarios createUser(Usuarios usuarios) {
        if (usuarios.getUsername() != null && getUserByUsername(usuarios.getUsername()) != null) {
            throw new RuntimeException("El nombre de usuario ya existe: " + usuarios.getUsername());
        }
        if (usuarios.getPassword() != null) {
            usuarios.setPassword(passwordEncoder.encode(usuarios.getPassword()));
        }
        return usuariosRepository.save(usuarios);
    }

    public List<Usuarios> getAllUsers() {
        return usuariosRepository.findAll();
    }

    public Usuarios getUserById(Long id) {
        return usuariosRepository.findById(id).orElse(null);
    }

    public Usuarios getUserByUsername(String username) {
        return usuariosRepository.findByUsername(username).orElse(null);
    }

    public Usuarios authenticate(String username, String rawPassword) {
        Usuarios user = getUserByUsername(username);
        if (user != null && passwordEncoder.matches(rawPassword, user.getPassword())) {
            return user;
        }
        return null; // Authentication failed
    }

    public Usuarios updateUser(Long id, Usuarios usuarios) {
        Usuarios existingUser = usuariosRepository.findById(id).orElse(null);
        if (existingUser != null) {
            if (usuarios.getUsername() != null) {
                existingUser.setUsername(usuarios.getUsername());
            }
            if (usuarios.getPassword() != null && !usuarios.getPassword().isEmpty()) {
                existingUser.setPassword(passwordEncoder.encode(usuarios.getPassword()));
            }
            if (usuarios.getRoles() != null) {
                existingUser.setRoles(usuarios.getRoles());
            }
            if (usuarios.getFarmacia() != null) {
                existingUser.setFarmacia(usuarios.getFarmacia());
            }
            if (usuarios.getFuncionario() != null) {
                existingUser.setFuncionario(usuarios.getFuncionario());
            }
            if (usuarios.getStatus() != null) {
                existingUser.setStatus(usuarios.getStatus());
            }
            return usuariosRepository.save(existingUser);
        }
        return null;
    }

    public void deleteUser(Long id) {
        usuariosRepository.deleteById(id);
    }
}
