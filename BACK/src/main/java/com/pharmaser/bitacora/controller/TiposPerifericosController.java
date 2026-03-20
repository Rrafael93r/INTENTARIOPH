package com.pharmaser.bitacora.controller;

import com.pharmaser.bitacora.model.TiposPerifericos;
import com.pharmaser.bitacora.service.TiposPerifericosService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tipos-perifericos")
@CrossOrigin(origins = "http://localhost:3000") // Adjust according to frontend root
public class TiposPerifericosController {

    @Autowired
    private TiposPerifericosService tiposPerifericosService;

    @GetMapping
    public List<TiposPerifericos> getAllTiposPerifericos() {
        return tiposPerifericosService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<TiposPerifericos> getTipoPerifericoById(@PathVariable Long id) {
        TiposPerifericos tipoPeriferico = tiposPerifericosService.findById(id);
        if (tipoPeriferico != null) {
            return ResponseEntity.ok(tipoPeriferico);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public TiposPerifericos createTipoPeriferico(@RequestBody TiposPerifericos tipoPeriferico) {
        return tiposPerifericosService.save(tipoPeriferico);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TiposPerifericos> updateTipoPeriferico(@PathVariable Long id,
            @RequestBody TiposPerifericos tipoDetails) {
        TiposPerifericos tipoPeriferico = tiposPerifericosService.findById(id);
        if (tipoPeriferico != null) {
            tipoPeriferico.setNombre(tipoDetails.getNombre());
            return ResponseEntity.ok(tiposPerifericosService.save(tipoPeriferico));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTipoPeriferico(@PathVariable Long id) {
        if (tiposPerifericosService.findById(id) != null) {
            tiposPerifericosService.delete(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
