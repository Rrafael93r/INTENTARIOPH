package com.pharmaser.bitacora.repository;

import com.pharmaser.bitacora.model.Funcionarios;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FuncionariosRepository extends JpaRepository <Funcionarios, Long> {
}
