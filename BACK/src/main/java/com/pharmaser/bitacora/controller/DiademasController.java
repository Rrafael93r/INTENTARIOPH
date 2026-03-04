package com.pharmaser.bitacora.controller;

import com.pharmaser.bitacora.model.Diademas;
import com.pharmaser.bitacora.service.DiademasService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/diademas")
public class DiademasController {

    @Autowired
    private DiademasService diademasService;

    @GetMapping("")
    public List<Diademas> getAllDiademas() {
        return diademasService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Diademas> getDiademasById(@PathVariable Long id) {
        Diademas diademas = diademasService.findById(id);
        if (diademas != null) {
            return ResponseEntity.ok(diademas);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("")
    public Diademas createDiademas(@RequestBody Diademas diademas) {
        return diademasService.save(diademas);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Diademas> updatedDiademas(@PathVariable Long id, @RequestBody Diademas diademasDetails) {
        Diademas updatedDiademas = diademasService.findById(id);
        if (updatedDiademas != null) {
            updatedDiademas.setDescripcion(diademasDetails.getDescripcion());
            updatedDiademas.setEstado(diademasDetails.getEstado());
            updatedDiademas.setFechaCompra(diademasDetails.getFechaCompra());
            updatedDiademas.setFuncionario(diademasDetails.getFuncionario());
            updatedDiademas.setMarca(diademasDetails.getMarca());
            updatedDiademas.setModelo(diademasDetails.getModelo());
            return ResponseEntity.ok(diademasService.save(updatedDiademas));

        } else {
            return ResponseEntity.notFound().build();
        }

    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDiademas(@PathVariable Long id) {
        if (diademasService.findById(id) != null) {
            diademasService.delete(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

}
