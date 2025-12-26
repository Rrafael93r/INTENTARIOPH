package com.pharmaser.bitacora.service;

import com.pharmaser.bitacora.model.Marcas;
import com.pharmaser.bitacora.repository.MarcasRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MarcasService {

    @Autowired
    private MarcasRepository marcasRepository;

    public List<Marcas> findAll() {
        return marcasRepository.findAll();
    }

    public Marcas findById(Long id) {
        return marcasRepository.findById(id).orElse(null);
    }

    public Marcas save(Marcas marcas) {
        return marcasRepository.save(marcas);
    }

    public void delete(Long id) {
        marcasRepository.deleteById(id);
    }
}
