package com.pharmaser.bitacora.controller;

import com.pharmaser.bitacora.model.Portatiles;
import com.pharmaser.bitacora.service.PortatilesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/Portatiles")
public class PortatilesController {

    @Autowired
    private PortatilesService portatilesService;

    @GetMapping("")
    public List<Portatiles> getAllPortatiles() {
        return portatilesService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Portatiles> getPortatilesById(@PathVariable Long id) {
        Portatiles portatiles = portatilesService.findById(id);
        if (portatiles != null) {
            return ResponseEntity.ok(portatiles);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("")
    public Portatiles createPortatiles(@RequestBody Portatiles portatiles) {
        return portatilesService.save(portatiles);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Portatiles> updatePortatiles(@PathVariable Long id,
            @RequestBody Portatiles portatilesDetails) {
        Portatiles updatePortatiles = portatilesService.findById(id);
        if (updatePortatiles != null) {
            updatePortatiles.setDescripcion(portatilesDetails.getDescripcion());
            updatePortatiles.setEstado(portatilesDetails.getEstado());
            updatePortatiles.setFuncionario(portatilesDetails.getFuncionario());
            updatePortatiles.setMarca(portatilesDetails.getMarca());
            updatePortatiles.setModelo(portatilesDetails.getModelo());
            updatePortatiles.setSerial(portatilesDetails.getSerial());
            updatePortatiles.setFechaCompra(portatilesDetails.getFechaCompra());
            return ResponseEntity.ok(portatilesService.save(updatePortatiles));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePortatiles(@PathVariable Long id) {
        if (portatilesService.findById(id) != null) {
            portatilesService.delete(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
