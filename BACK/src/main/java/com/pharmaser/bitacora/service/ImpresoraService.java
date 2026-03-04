package com.pharmaser.bitacora.service;

import com.pharmaser.bitacora.model.Impresora;
import com.pharmaser.bitacora.repository.ImpresoraRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ImpresoraService {

    @Autowired
    private ImpresoraRepository repository;

    public List<Impresora> getAllImpresoras() {
        return repository.findAll();
    }

    public Impresora createImpresora(Impresora impresora) {
        return repository.save(impresora);
    }

    public Optional<Impresora> getImpresoraById(Long id) {
        return repository.findById(id);
    }

    public void deleteImpresora(Long id) {
        repository.deleteById(id);
    }
}
