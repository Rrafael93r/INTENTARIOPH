package com.pharmaser.bitacora.controller;

import com.pharmaser.bitacora.model.Perifericos;
import com.pharmaser.bitacora.service.PerifericosService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/perifericos")
public class PerifericosController {

    @Autowired
    private PerifericosService perifericosService;

    @GetMapping("")
    public List<Perifericos> getAllPerifericos() {
        return perifericosService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Perifericos> getPerifericoById(@PathVariable Long id) {
        Perifericos periferico = perifericosService.findById(id);
        if (periferico != null) {
            return ResponseEntity.ok(periferico);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("")
    public Perifericos createPeriferico(@RequestBody Perifericos periferico) {
        return perifericosService.save(periferico);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Perifericos> updatePeriferico(@PathVariable Long id,
            @RequestBody Perifericos perifericoDetails) {
        Perifericos periferico = perifericosService.findById(id);
        if (periferico != null) {
            periferico.setMarca(perifericoDetails.getMarca());
            periferico.setModelo(perifericoDetails.getModelo());
            periferico.setSerial(perifericoDetails.getSerial());
            periferico.setEstado(perifericoDetails.getEstado());
            periferico.setFechaCompra(perifericoDetails.getFechaCompra());
            periferico.setDescripcion(perifericoDetails.getDescripcion());
            periferico.setTipoPeriferico(perifericoDetails.getTipoPeriferico());
            periferico.setFuncionario(perifericoDetails.getFuncionario());
            periferico.setDeleted(perifericoDetails.getDeleted());

            return ResponseEntity.ok(perifericosService.save(periferico));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePeriferico(@PathVariable Long id) {
        if (perifericosService.findById(id) != null) {
            perifericosService.delete(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
