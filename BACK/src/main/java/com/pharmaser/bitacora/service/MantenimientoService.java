package com.pharmaser.bitacora.service;

import com.pharmaser.bitacora.model.Mantenimiento;
import com.pharmaser.bitacora.repository.MantenimientoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MantenimientoService {

    @Autowired
    private MantenimientoRepository mantenimientoRepository;

    public List<Mantenimiento> findAll() {
        return mantenimientoRepository.findAll();
    }

    public Mantenimiento findById(Long id) {
        return mantenimientoRepository.findById(id).orElse(null);
    }

    public List<Mantenimiento> findByEquipo(String tipoEquipo, Long equipoId) {
        return mantenimientoRepository.findByTipoEquipoAndEquipoId(tipoEquipo, equipoId);
    }

    public Mantenimiento save(Mantenimiento mantenimiento) {
        return mantenimientoRepository.save(mantenimiento);
    }

    public void delete(Long id) {
        mantenimientoRepository.deleteById(id);
    }
}
