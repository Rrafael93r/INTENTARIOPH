package com.pharmaser.bitacora.controller;

import com.pharmaser.bitacora.model.Mouses;
import com.pharmaser.bitacora.service.MouseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/Mouses")
public class MousesController {

    @Autowired
    private MouseService mouseServicie;

    @GetMapping("")
    public List<Mouses> getAllMouses() {
        return mouseServicie.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Mouses> getMouseById(@PathVariable Long id) {
        Mouses mouse = mouseServicie.findById(id);
        if (mouse != null) {
            return ResponseEntity.ok(mouse);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("")
    public Mouses createMouses(@RequestBody Mouses mouses) {
        return mouseServicie.save(mouses);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Mouses> updateMouses(@PathVariable Long id, @RequestBody Mouses mousesDetails) {
        Mouses updateMouses = mouseServicie.findById(id);
        if (updateMouses != null) {
            updateMouses.setDescripcion(mousesDetails.getDescripcion());
            updateMouses.setEstado(mousesDetails.getEstado());
            updateMouses.setFuncionarios(mousesDetails.getFuncionarios());
            updateMouses.setMarca(mousesDetails.getMarca());
            updateMouses.setModelo(mousesDetails.getModelo());
            updateMouses.setSerial(mousesDetails.getSerial());
            updateMouses.setFecha_compra(mousesDetails.getFecha_compra());
            return ResponseEntity.ok(mouseServicie.save(updateMouses));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMouses(@PathVariable Long id) {
        if (mouseServicie.findById(id) != null) {
            mouseServicie.delete(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
