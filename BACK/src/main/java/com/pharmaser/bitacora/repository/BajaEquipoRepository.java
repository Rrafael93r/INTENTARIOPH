package com.pharmaser.bitacora.repository;

import com.pharmaser.bitacora.model.BajaEquipo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface BajaEquipoRepository extends JpaRepository<BajaEquipo, Long> {
    List<BajaEquipo> findByTipoEquipo(String tipoEquipo);
    List<BajaEquipo> findByFechaBajaBetween(LocalDate inicio, LocalDate fin);
}
