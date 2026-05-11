package com.pharmaser.bitacora.controller;

import com.pharmaser.bitacora.model.Mantenimiento;
import com.pharmaser.bitacora.service.MantenimientoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/mantenimientos")
public class MantenimientoController {

    @Autowired
    private MantenimientoService mantenimientoService;

    @GetMapping("")
    public List<Mantenimiento> getAll() {
        return mantenimientoService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Mantenimiento> getById(@PathVariable Long id) {
        Mantenimiento m = mantenimientoService.findById(id);
        return m != null ? ResponseEntity.ok(m) : ResponseEntity.notFound().build();
    }

    @GetMapping("/equipo")
    public List<Mantenimiento> getByEquipo(
            @RequestParam String tipoEquipo,
            @RequestParam Long equipoId) {
        return mantenimientoService.findByEquipo(tipoEquipo, equipoId);
    }

    @PostMapping("")
    public Mantenimiento create(@RequestBody Mantenimiento mantenimiento) {
        return mantenimientoService.save(mantenimiento);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Mantenimiento> update(@PathVariable Long id,
            @RequestBody Mantenimiento details) {
        Mantenimiento existing = mantenimientoService.findById(id);
        if (existing == null) return ResponseEntity.notFound().build();

        existing.setTipoEquipo(details.getTipoEquipo());
        existing.setEquipoId(details.getEquipoId());
        existing.setTipoMantenimiento(details.getTipoMantenimiento());
        existing.setDescripcion(details.getDescripcion());
        existing.setFecha(details.getFecha());
        existing.setTecnico(details.getTecnico());
        existing.setCosto(details.getCosto());
        existing.setResultado(details.getResultado());
        existing.setObservaciones(details.getObservaciones());

        return ResponseEntity.ok(mantenimientoService.save(existing));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (mantenimientoService.findById(id) == null) return ResponseEntity.notFound().build();
        mantenimientoService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
