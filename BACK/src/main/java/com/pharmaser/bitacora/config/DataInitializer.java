package com.pharmaser.bitacora.config;

import com.pharmaser.bitacora.model.Roles;
import com.pharmaser.bitacora.model.Usuarios;
import com.pharmaser.bitacora.repository.RolesRepository;
import com.pharmaser.bitacora.repository.UsuariosRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Autowired
    private RolesRepository rolesRepository;

    @Autowired
    private UsuariosRepository usuariosRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Bean
    public CommandLineRunner initData() {
        return args -> {
            // Asegurarnos de que el Rol Admin exista (ID 1 típicamente)
            Roles adminRole = rolesRepository.findById(1L).orElse(null);
            if (adminRole == null) {
                adminRole = new Roles();
                adminRole.setName("ADMIN");
                // Forzamos que se guarde. Dependiendo de la BD, auto-incrementará.
                adminRole = rolesRepository.save(adminRole);
            }

            // Validar si el usuario 'admin' ya existe
            Usuarios adminUser = usuariosRepository.findByUsername("admin").orElse(null);
            if (adminUser == null) {
                adminUser = new Usuarios();
                adminUser.setUsername("admin");
                adminUser.setPassword(passwordEncoder.encode("admin"));
                adminUser.setRoles(adminRole);
                adminUser.setStatus(true);
                usuariosRepository.save(adminUser);
                System.out.println("Usuario 'admin' creado exitosamente con contraseña 'admin'.");
            } else {
                System.out.println("El usuario 'admin' ya existe en el sistema.");
            }
        };
    }
}
