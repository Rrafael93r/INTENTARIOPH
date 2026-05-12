package com.pharmaser.bitacora.repository;

import com.pharmaser.bitacora.model.Mantenimiento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MantenimientoRepository extends JpaRepository<Mantenimiento, Long> {
    List<Mantenimiento> findByTipoEquipoAndEquipoId(String tipoEquipo, Long equipoId);
    List<Mantenimiento> findByTipoEquipo(String tipoEquipo);
}
