package com.pharmaser.bitacora.service;

import com.pharmaser.bitacora.model.BajaEquipo;
import com.pharmaser.bitacora.repository.BajaEquipoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class BajaEquipoService {

    @Autowired
    private BajaEquipoRepository bajaEquipoRepository;

    public List<BajaEquipo> findAll() {
        return bajaEquipoRepository.findAll();
    }

    public BajaEquipo findById(Long id) {
        return bajaEquipoRepository.findById(id).orElse(null);
    }

    public List<BajaEquipo> findByRangoFechas(LocalDate inicio, LocalDate fin) {
        return bajaEquipoRepository.findByFechaBajaBetween(inicio, fin);
    }

    public BajaEquipo save(BajaEquipo bajaEquipo) {
        return bajaEquipoRepository.save(bajaEquipo);
    }

    public void delete(Long id) {
        bajaEquipoRepository.deleteById(id);
    }
}
