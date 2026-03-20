package com.pharmaser.bitacora.controller;

import com.pharmaser.bitacora.model.Impresora;
import com.pharmaser.bitacora.service.ImpresoraService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/impresoras")
@CrossOrigin(origins = "http://localhost:5173")
public class ImpresoraController {

    @Autowired
    private ImpresoraService service;

    @GetMapping
    public List<Impresora> getAllImpresoras() {
        return service.getAllImpresoras();
    }

    @PostMapping
    public Impresora createImpresora(@RequestBody Impresora impresora) {
        return service.createImpresora(impresora);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Impresora> updateImpresora(@PathVariable Long id, @RequestBody Impresora impresoraDetails) {
        Optional<Impresora> existingImpresora = service.getImpresoraById(id);
        if (existingImpresora.isPresent()) {
            Impresora impresora = existingImpresora.get();
            impresora.setDescripcion(impresoraDetails.getDescripcion());
            impresora.setEstado(impresoraDetails.getEstado());
            impresora.setFuncionario(impresoraDetails.getFuncionario());
            impresora.setMarca(impresoraDetails.getMarca());
            impresora.setModelo(impresoraDetails.getModelo());
            impresora.setSerial(impresoraDetails.getSerial());
            impresora.setFechaCompra(impresoraDetails.getFechaCompra());
            return ResponseEntity.ok(service.createImpresora(impresora));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{id}")
    public Optional<Impresora> getImpresoraById(@PathVariable Long id) {
        return service.getImpresoraById(id);
    }

    @DeleteMapping("/{id}")
    public void deleteImpresora(@PathVariable Long id) {
        service.deleteImpresora(id);
    }
}
