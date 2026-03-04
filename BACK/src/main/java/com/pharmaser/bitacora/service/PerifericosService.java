package com.pharmaser.bitacora.service;

import com.pharmaser.bitacora.model.Perifericos;
import com.pharmaser.bitacora.repository.PerifericosRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PerifericosService {

    @Autowired
    private PerifericosRepository perifericosRepository;

    public List<Perifericos> findAll() {
        return perifericosRepository.findAll();
    }

    public Perifericos findById(Long id) {
        Optional<Perifericos> periferico = perifericosRepository.findById(id);
        return periferico.orElse(null);
    }

    public Perifericos save(Perifericos periferico) {
        return perifericosRepository.save(periferico);
    }

    public void delete(Long id) {
        perifericosRepository.deleteById(id);
    }
}
