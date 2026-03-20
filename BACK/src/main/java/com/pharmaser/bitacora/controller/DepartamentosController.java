package com.pharmaser.bitacora.controller;



import com.pharmaser.bitacora.model.Departamentos;
import com.pharmaser.bitacora.service.DepartamentosServicie;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/departamentos")
public class DepartamentosController {


    @Autowired
    private DepartamentosServicie departamentosServicie;

    @GetMapping("")
    public List<Departamentos> getAllDepartamentos() {
        return departamentosServicie.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Departamentos> getDepartamentosById(@PathVariable Long id) {
        Departamentos departamentos = departamentosServicie.findById(id);
        if (departamentos != null) {
            return ResponseEntity.ok(departamentos);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("")
    public Departamentos createDepartamentos(@RequestBody Departamentos departamentos) {
        return departamentosServicie.save(departamentos);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Departamentos> updatedRole(@PathVariable Long id, @RequestBody Departamentos departamentosDetails) {
        Departamentos updatedDepartamentos = departamentosServicie.findById(id);
        if (updatedDepartamentos != null) {
            updatedDepartamentos.setNameDepartamento(departamentosDetails.getNameDepartamento());
            return ResponseEntity.ok(departamentosServicie.save(updatedDepartamentos));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDepartamentos(@PathVariable Long id) {
        if (departamentosServicie.findById(id) != null) {
            departamentosServicie.delete(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
