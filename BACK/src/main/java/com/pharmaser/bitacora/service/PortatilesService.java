package com.pharmaser.bitacora.service;


import com.pharmaser.bitacora.model.Portatiles;
import com.pharmaser.bitacora.repository.PortatilesRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PortatilesService {

    @org.springframework.beans.factory.annotation.Autowired
    private PortatilesRepository portatilesRepository;


    public List<Portatiles> findAll(){
        return portatilesRepository.findAll();
    }
    public Portatiles findById(Long id){
        return portatilesRepository.findById(id).orElse(null);
    }

    public Portatiles save(Portatiles portatile){
        return portatilesRepository.save(portatile);
    }

    public void delete(Long id){
        portatilesRepository.deleteById(id);
    }
}
