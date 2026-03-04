package com.pharmaser.bitacora.controller;

import com.pharmaser.bitacora.model.Funcionarios;
import com.pharmaser.bitacora.service.FuncionariosService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/funcionarios")
public class FuncionariosController {

    @Autowired
    private FuncionariosService funcionariosService;

    @GetMapping("")
    public List<Funcionarios> getAllFuncionarios() {
        return funcionariosService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Funcionarios> getFuncionariosById(@PathVariable Long id) {
        Funcionarios funcionarios = funcionariosService.findById(id);
        if (funcionarios != null) {
            return ResponseEntity.ok(funcionarios);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("")
    public Funcionarios createFuncionarios(@RequestBody Funcionarios funcionarios) {
        return funcionariosService.save(funcionarios);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Funcionarios> updateFuncionarios(@PathVariable Long id,
            @RequestBody Funcionarios funcionariosDetails) {
        Funcionarios funcionarios = funcionariosService.findById(id);
        if (funcionarios != null) {
            funcionarios.setNombre(funcionariosDetails.getNombre());
            funcionarios.setApellido(funcionariosDetails.getApellido());
            funcionarios.setArea(funcionariosDetails.getArea());
            funcionarios.setCorreo(funcionariosDetails.getCorreo());
            funcionarios.setFarmacias(funcionariosDetails.getFarmacias());
            funcionarios.setFarmacias(funcionariosDetails.getFarmacias());
            // Assets references removed as relationships are inverted
            return ResponseEntity.ok(funcionariosService.save(funcionarios));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFuncionarios(@PathVariable Long id) {
        Funcionarios funcionarios = funcionariosService.findById(id);
        if (funcionarios != null) {
            funcionariosService.delete(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}