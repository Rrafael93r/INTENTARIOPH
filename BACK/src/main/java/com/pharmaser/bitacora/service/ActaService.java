package com.pharmaser.bitacora.service;

import com.pharmaser.bitacora.model.Acta;
import com.pharmaser.bitacora.repository.ActaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ActaService {

    @Autowired
    private ActaRepository repository;

    public List<Acta> getAllActas() {
        return repository.findAll();
    }

    public Acta createActa(Acta acta) {
        return repository.save(acta);
    }

    public Optional<Acta> getActaById(Long id) {
        return repository.findById(id);
    }

    public void deleteActa(Long id) {
        repository.deleteById(id);
    }
}
