package com.pharmaser.bitacora.controller;

import com.pharmaser.bitacora.model.Areas;
import com.pharmaser.bitacora.service.AreasService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/areas")
public class AreasController {

    @Autowired
    private AreasService areasService;

    @GetMapping("")
    public List<Areas> getAllAreas() {
        return areasService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Areas> getAreaById(@PathVariable Long id) {
        Areas area = areasService.findById(id);
        if (area != null) {
            return ResponseEntity.ok(area);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("")
    public Areas createArea(@RequestBody Areas areas) {
        return areasService.save(areas);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Areas> updateArea(@PathVariable Long id, @RequestBody Areas areaDetails) {
        Areas area = areasService.findById(id);
        if (area != null) {
            area.setNombre(areaDetails.getNombre());
            return ResponseEntity.ok(areasService.save(area));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteArea(@PathVariable Long id) {
        if (areasService.findById(id) != null) {
            areasService.delete(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
