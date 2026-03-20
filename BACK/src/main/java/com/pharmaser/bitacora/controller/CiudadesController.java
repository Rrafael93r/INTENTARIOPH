package com.pharmaser.bitacora.controller;

import com.pharmaser.bitacora.model.Ciudades;
import com.pharmaser.bitacora.service.CiudadesServicie;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/ciudades")
public class CiudadesController {

    @Autowired
    private CiudadesServicie ciudadesServicie;

    @GetMapping("")
    public List<Ciudades> getAllCiudades() {
        return ciudadesServicie.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Ciudades> getCiudadesById(@PathVariable Long id) {
        Ciudades ciudades = ciudadesServicie.findById(id);
        if (ciudades != null) {
            return ResponseEntity.ok(ciudades);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("")
    public Ciudades createCiudades(@RequestBody Ciudades ciudades) {
        return ciudadesServicie.save(ciudades);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Ciudades> updateRole(@PathVariable Long id, @RequestBody Ciudades ciudadesDetails) {
        Ciudades updatedCiudades = ciudadesServicie.findById(id);
        if (updatedCiudades != null) {
            updatedCiudades.setNombreCiudad(ciudadesDetails.getNombreCiudad());
            updatedCiudades.setDepartamento(ciudadesDetails.getDepartamento());
            return ResponseEntity.ok(ciudadesServicie.save(updatedCiudades));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCiudades(@PathVariable Long id) {
        if (ciudadesServicie.findById(id) != null) {
            ciudadesServicie.delete(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}