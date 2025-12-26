package com.pharmaser.bitacora.controller;

import com.pharmaser.bitacora.model.Marcas;
import com.pharmaser.bitacora.service.MarcasService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/marcas")
public class MarcasController {

    @Autowired
    private MarcasService marcasService;

    @GetMapping("")
    public List<Marcas> getAllMarcas() {
        return marcasService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Marcas> getMarcaById(@PathVariable Long id) {
        Marcas marca = marcasService.findById(id);
        if (marca != null) {
            return ResponseEntity.ok(marca);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("")
    public Marcas createMarca(@RequestBody Marcas marcas) {
        return marcasService.save(marcas);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Marcas> updateMarca(@PathVariable Long id, @RequestBody Marcas marcaDetails) {
        Marcas marca = marcasService.findById(id);
        if (marca != null) {
            marca.setNombre(marcaDetails.getNombre());
            return ResponseEntity.ok(marcasService.save(marca));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMarca(@PathVariable Long id) {
        if (marcasService.findById(id) != null) {
            marcasService.delete(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
