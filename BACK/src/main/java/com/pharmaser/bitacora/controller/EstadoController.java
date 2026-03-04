package com.pharmaser.bitacora.controller;

import com.pharmaser.bitacora.model.Estado;
import com.pharmaser.bitacora.service.EstadoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/estados")
@CrossOrigin(origins = "*") // Allow requests from frontend
public class EstadoController {

    @Autowired
    private EstadoService estadoService;

    @GetMapping
    public List<Estado> getAllEstados() {
        return estadoService.getAllEstados();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Estado> getEstadoById(@PathVariable Long id) {
        return estadoService.getEstadoById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Estado createEstado(@RequestBody Estado estado) {
        return estadoService.createEstado(estado);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Estado> updateEstado(@PathVariable Long id, @RequestBody Estado estadoDetails) {
        Estado updatedEstado = estadoService.updateEstado(id, estadoDetails);
        if (updatedEstado != null) {
            return ResponseEntity.ok(updatedEstado);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEstado(@PathVariable Long id) {
        estadoService.deleteEstado(id);
        return ResponseEntity.noContent().build();
    }
}
