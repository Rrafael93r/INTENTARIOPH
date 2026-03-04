package com.pharmaser.bitacora.service;

import com.pharmaser.bitacora.model.Estado;
import com.pharmaser.bitacora.repository.EstadoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EstadoService {

    @Autowired
    private EstadoRepository estadoRepository;

    public List<Estado> getAllEstados() {
        return estadoRepository.findAll();
    }

    public Optional<Estado> getEstadoById(long id) {
        return estadoRepository.findById(id);
    }

    public Estado createEstado(Estado estado) {
        return estadoRepository.save(estado);
    }

    public Estado updateEstado(long id, Estado estadoDetails) {
        return estadoRepository.findById(id).map(estado -> {
            estado.setNombre(estadoDetails.getNombre());
            estado.setDescripcion(estadoDetails.getDescripcion());
            return estadoRepository.save(estado);
        }).orElse(null);
    }

    public void deleteEstado(long id) {
        estadoRepository.deleteById(id);
    }
}
