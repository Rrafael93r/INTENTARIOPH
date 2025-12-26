package com.pharmaser.bitacora.service;

import com.pharmaser.bitacora.model.Areas;
import com.pharmaser.bitacora.repository.AreasRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AreasService {

    @Autowired
    private AreasRepository areasRepository;

    public List<Areas> findAll() {
        return areasRepository.findAll();
    }

    public Areas findById(Long id) {
        return areasRepository.findById(id).orElse(null);
    }

    public Areas save(Areas areas) {
        return areasRepository.save(areas);
    }

    public void delete(Long id) {
        areasRepository.deleteById(id);
    }
}
