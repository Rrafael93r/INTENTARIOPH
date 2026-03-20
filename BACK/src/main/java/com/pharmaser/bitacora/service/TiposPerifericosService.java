package com.pharmaser.bitacora.service;

import com.pharmaser.bitacora.model.TiposPerifericos;
import com.pharmaser.bitacora.repository.TiposPerifericosRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

import org.springframework.lang.NonNull;

@Service
public class TiposPerifericosService {

    @Autowired
    private TiposPerifericosRepository tiposPerifericosRepository;

    public List<TiposPerifericos> findAll() {
        return tiposPerifericosRepository.findAll();
    }

    public TiposPerifericos save(@NonNull TiposPerifericos tipoPeriferico) {
        return tiposPerifericosRepository.save(tipoPeriferico);
    }

    public TiposPerifericos findById(@NonNull Long id) {
        return tiposPerifericosRepository.findById(id).orElse(null);
    }

    public void delete(@NonNull Long id) {
        tiposPerifericosRepository.deleteById(id);
    }
}
