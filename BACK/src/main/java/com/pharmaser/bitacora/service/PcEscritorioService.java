package com.pharmaser.bitacora.service;

import com.pharmaser.bitacora.model.PcEscritorio;
import com.pharmaser.bitacora.repository.PcEscritorioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PcEscritorioService {

    @Autowired
    private PcEscritorioRepository repository;

    public List<PcEscritorio> getAllPcEscritorio() {
        return repository.findAll();
    }

    public PcEscritorio createPcEscritorio(PcEscritorio pcEscritorio) {
        return repository.save(pcEscritorio);
    }

    public Optional<PcEscritorio> getPcEscritorioById(Long id) {
        return repository.findById(id);
    }

    public void deletePcEscritorio(Long id) {
        repository.deleteById(id);
    }
}
