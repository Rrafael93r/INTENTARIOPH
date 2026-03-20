package com.pharmaser.bitacora.controller;

import com.pharmaser.bitacora.model.Monitores;
import com.pharmaser.bitacora.service.MonitoresService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/monitores") // Ruta en minúsculas
public class MonitoresController {

    @Autowired
    private MonitoresService monitoresService;

    // Obtener todos los monitores
    @GetMapping("")
    public List<Monitores> getAllMonitores() {
        return monitoresService.findAll();
    }

    // Obtener un monitor por ID
    @GetMapping("/{id}")
    public ResponseEntity<Monitores> getMonitorById(@PathVariable Long id) {
        Monitores monitor = monitoresService.findById(id);
        if (monitor != null) {
            return ResponseEntity.ok(monitor);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Crear un nuevo monitor
    @PostMapping("")
    public Monitores createMonitor(@RequestBody Monitores monitor) {
        return monitoresService.save(monitor);
    }

    // Actualizar un monitor existente
    @PutMapping("/{id}")
    public ResponseEntity<Monitores> updateMonitor(@PathVariable Long id, @RequestBody Monitores monitorDetails) {
        Monitores existingMonitor = monitoresService.findById(id);
        if (existingMonitor != null) {
            existingMonitor.setDescripcion(monitorDetails.getDescripcion());
            existingMonitor.setEstado(monitorDetails.getEstado());
            existingMonitor.setFuncionario(monitorDetails.getFuncionario());
            existingMonitor.setMarca(monitorDetails.getMarca());
            existingMonitor.setModelo(monitorDetails.getModelo());
            existingMonitor.setSerial(monitorDetails.getSerial());
            existingMonitor.setFechaCompra(monitorDetails.getFechaCompra());
            return ResponseEntity.ok(monitoresService.save(existingMonitor));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Eliminar un monitor
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMonitor(@PathVariable Long id) {
        if (monitoresService.findById(id) != null) {
            monitoresService.delete(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}