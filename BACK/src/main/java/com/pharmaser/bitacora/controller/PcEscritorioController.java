package com.pharmaser.bitacora.controller;

import com.pharmaser.bitacora.model.PcEscritorio;
import com.pharmaser.bitacora.service.PcEscritorioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/pcComputadores")
@CrossOrigin(origins = "http://localhost:5173")
public class PcEscritorioController {

    @Autowired
    private PcEscritorioService service;

    @GetMapping
    public List<PcEscritorio> getAllPcEscritorio() {
        return service.getAllPcEscritorio();
    }

    @PostMapping
    public PcEscritorio createPcEscritorio(@RequestBody PcEscritorio pcEscritorio) {
        return service.createPcEscritorio(pcEscritorio);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PcEscritorio> updatePcEscritorio(@PathVariable Long id, @RequestBody PcEscritorio pcDetails) {
        Optional<PcEscritorio> existingPc = service.getPcEscritorioById(id);
        if (existingPc.isPresent()) {
            PcEscritorio pc = existingPc.get();
            pc.setDescripcion(pcDetails.getDescripcion());
            pc.setEstado(pcDetails.getEstado());
            pc.setFuncionario(pcDetails.getFuncionario());
            pc.setMarca(pcDetails.getMarca());
            pc.setModelo(pcDetails.getModelo());
            pc.setSerial(pcDetails.getSerial());
            pc.setFechaCompra(pcDetails.getFechaCompra());
            return ResponseEntity.ok(service.createPcEscritorio(pc));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{id}")
    public Optional<PcEscritorio> getPcEscritorioById(@PathVariable Long id) {
        return service.getPcEscritorioById(id);
    }

    @DeleteMapping("/{id}")
    public void deletePcEscritorio(@PathVariable Long id) {
        service.deletePcEscritorio(id);
    }
}
