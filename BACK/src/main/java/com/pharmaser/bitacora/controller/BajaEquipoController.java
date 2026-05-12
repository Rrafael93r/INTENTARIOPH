package com.pharmaser.bitacora.controller;

import com.pharmaser.bitacora.model.BajaEquipo;
import com.pharmaser.bitacora.service.BajaEquipoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/bajas-equipos")
public class BajaEquipoController {

    @Autowired
    private BajaEquipoService bajaEquipoService;

    @GetMapping("")
    public List<BajaEquipo> getAll() {
        return bajaEquipoService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<BajaEquipo> getById(@PathVariable Long id) {
        BajaEquipo b = bajaEquipoService.findById(id);
        return b != null ? ResponseEntity.ok(b) : ResponseEntity.notFound().build();
    }

    @GetMapping("/rango")
    public List<BajaEquipo> getByRango(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate inicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fin) {
        return bajaEquipoService.findByRangoFechas(inicio, fin);
    }

    @PostMapping("")
    public BajaEquipo create(@RequestBody BajaEquipo bajaEquipo) {
        return bajaEquipoService.save(bajaEquipo);
    }

    @PutMapping("/{id}")
    public ResponseEntity<BajaEquipo> update(@PathVariable Long id,
            @RequestBody BajaEquipo details) {
        BajaEquipo existing = bajaEquipoService.findById(id);
        if (existing == null) return ResponseEntity.notFound().build();

        existing.setTipoEquipo(details.getTipoEquipo());
        existing.setEquipoId(details.getEquipoId());
        existing.setSerial(details.getSerial());
        existing.setMarca(details.getMarca());
        existing.setModelo(details.getModelo());
        existing.setMotivoBaja(details.getMotivoBaja());
        existing.setFechaBaja(details.getFechaBaja());
        existing.setDescripcion(details.getDescripcion());
        existing.setUltimoFuncionario(details.getUltimoFuncionario());
        existing.setRegistradoPor(details.getRegistradoPor());

        return ResponseEntity.ok(bajaEquipoService.save(existing));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (bajaEquipoService.findById(id) == null) return ResponseEntity.notFound().build();
        bajaEquipoService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
