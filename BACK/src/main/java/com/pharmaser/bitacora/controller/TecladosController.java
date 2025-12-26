package com.pharmaser.bitacora.controller;

import com.pharmaser.bitacora.model.Teclados;
import com.pharmaser.bitacora.service.TecladosService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teclados")
public class TecladosController {

    @Autowired
    private TecladosService tecladosService;

    @GetMapping("")
    public List<Teclados> getAllTeclados() {
        return tecladosService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Teclados> getTecladoById(@PathVariable Long id) {
        Teclados teclado = tecladosService.findById(id);
        if (teclado != null) {
            return ResponseEntity.ok(teclado);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("")
    public Teclados createTeclado(@RequestBody Teclados teclado) {
        return tecladosService.save(teclado);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Teclados> updateTeclado(@PathVariable Long id, @RequestBody Teclados tecladoDetails) {
        Teclados teclado = tecladosService.findById(id);
        if (teclado != null) {
            teclado.setMarca(tecladoDetails.getMarca());
            teclado.setModelo(tecladoDetails.getModelo());
            teclado.setSerial(tecladoDetails.getSerial());
            teclado.setEstado(tecladoDetails.getEstado());
            teclado.setFecha_compra(tecladoDetails.getFecha_compra());
            teclado.setFuncionarios(tecladoDetails.getFuncionarios());

            return ResponseEntity.ok(tecladosService.save(teclado));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTeclado(@PathVariable Long id) {
        if (tecladosService.findById(id) != null) {
            tecladosService.delete(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
