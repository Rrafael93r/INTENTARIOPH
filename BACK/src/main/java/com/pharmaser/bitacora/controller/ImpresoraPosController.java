package com.pharmaser.bitacora.controller;

import com.pharmaser.bitacora.model.ImpresoraPos;
import com.pharmaser.bitacora.service.ImpresoraPosService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/impresorasPos")
@CrossOrigin(origins = "http://localhost:5173")
public class ImpresoraPosController {

    @Autowired
    private ImpresoraPosService service;

    @GetMapping
    public List<ImpresoraPos> getAllImpresorasPos() {
        return service.getAllImpresorasPos();
    }

    @PostMapping
    public ImpresoraPos createImpresoraPos(@RequestBody ImpresoraPos impresoraPos) {
        return service.createImpresoraPos(impresoraPos);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ImpresoraPos> updateImpresoraPos(@PathVariable Long id,
            @RequestBody ImpresoraPos impresoraPosDetails) {
        Optional<ImpresoraPos> existingImpresoraPos = service.getImpresoraPosById(id);
        if (existingImpresoraPos.isPresent()) {
            ImpresoraPos impresoraPos = existingImpresoraPos.get();
            impresoraPos.setDescripcion(impresoraPosDetails.getDescripcion());
            impresoraPos.setEstado(impresoraPosDetails.getEstado());
            impresoraPos.setFuncionario(impresoraPosDetails.getFuncionario());
            impresoraPos.setMarca(impresoraPosDetails.getMarca());
            impresoraPos.setModelo(impresoraPosDetails.getModelo());
            impresoraPos.setSerial(impresoraPosDetails.getSerial());
            impresoraPos.setFecha_compra(impresoraPosDetails.getFecha_compra());
            return ResponseEntity.ok(service.createImpresoraPos(impresoraPos));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{id}")
    public Optional<ImpresoraPos> getImpresoraPosById(@PathVariable Long id) {
        return service.getImpresoraPosById(id);
    }

    @DeleteMapping("/{id}")
    public void deleteImpresoraPos(@PathVariable Long id) {
        service.deleteImpresoraPos(id);
    }
}
