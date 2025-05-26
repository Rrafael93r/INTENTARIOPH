package com.pharmaser.bitacora.repository;

import com.pharmaser.bitacora.model.Usuarios;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UsuariosRepository extends JpaRepository<Usuarios, Long> {
    Optional<Usuarios> findByUsername(String username);
}
