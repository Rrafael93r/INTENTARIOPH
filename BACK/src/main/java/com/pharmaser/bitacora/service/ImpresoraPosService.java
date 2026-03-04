package com.pharmaser.bitacora.service;

import com.pharmaser.bitacora.model.ImpresoraPos;
import com.pharmaser.bitacora.repository.ImpresoraPosRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ImpresoraPosService {

    @Autowired
    private ImpresoraPosRepository repository;

    public List<ImpresoraPos> getAllImpresorasPos() {
        return repository.findAll();
    }

    public ImpresoraPos createImpresoraPos(ImpresoraPos impresoraPos) {
        return repository.save(impresoraPos);
    }

    public Optional<ImpresoraPos> getImpresoraPosById(Long id) {
        return repository.findById(id);
    }

    public void deleteImpresoraPos(Long id) {
        repository.deleteById(id);
    }
}
