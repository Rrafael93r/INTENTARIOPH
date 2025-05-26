package com.pharmaser.bitacora.controller;

import com.pharmaser.bitacora.model.Usuarios;
import com.pharmaser.bitacora.service.UsuariosService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UsuariosController {
    @Autowired
    private UsuariosService usuariosService;

    @PostMapping
    public ResponseEntity<Usuarios> createUser(@RequestBody Usuarios usuarios) {
        try {
            System.out.println("=== CREANDO NUEVO USUARIO ===");
            System.out.println("Datos recibidos: " + usuarios.toString());

            // Validaciones básicas
            if (usuarios.getUsername() == null || usuarios.getUsername().trim().isEmpty()) {
                throw new RuntimeException("El nombre de usuario es requerido");
            }
            if (usuarios.getPassword() == null || usuarios.getPassword().trim().isEmpty()) {
                throw new RuntimeException("La contraseña es requerida");
            }
            if (usuarios.getRole() == null) {
                throw new RuntimeException("El rol es requerido");
            }

            // Si es rol 3 (reportador), debe tener farmacia asignada
            if (usuarios.getRole().getId() == 3 && usuarios.getFarmacia() == null) {
                throw new RuntimeException("Los usuarios reportadores deben tener una farmacia asignada");
            }

            // Establecer valores por defecto
            if (usuarios.getStatus() == null) {
                usuarios.setStatus(true);
            }

            Usuarios savedUser = usuariosService.createUser(usuarios);
            System.out.println("Usuario creado con ID: " + savedUser.getId());
            return ResponseEntity.ok(savedUser);

        } catch (Exception e) {
            System.err.println("Error al crear usuario: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Error al crear el usuario: " + e.getMessage());
        }
    }

    @GetMapping
    public List<Usuarios> getAllUsers() {
        return usuariosService.getAllUsers();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Usuarios> getUser(@PathVariable Long id) {
        Usuarios user = usuariosService.getUserById(id);
        if (user != null) {
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/username/{username}")
    public ResponseEntity<Usuarios> getUserByUsername(@PathVariable String username) {
        Usuarios user = usuariosService.getUserByUsername(username);
        if (user != null) {
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Usuarios> updateUser(@PathVariable Long id, @RequestBody Usuarios usuarios) {
        try {
            System.out.println("=== ACTUALIZANDO USUARIO ID: " + id + " ===");
            System.out.println("Datos recibidos: " + usuarios.toString());

            Usuarios updatedUser = usuariosService.updateUser(id, usuarios);
            if (updatedUser != null) {
                System.out.println("Usuario actualizado exitosamente");
                return ResponseEntity.ok(updatedUser);
            }
            return ResponseEntity.notFound().build();

        } catch (Exception e) {
            System.err.println("Error al actualizar usuario: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Error al actualizar el usuario: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        try {
            usuariosService.deleteUser(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            System.err.println("Error al eliminar usuario: " + e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }
}
