package com.pharmaser.bitacora.controller;

import com.pharmaser.bitacora.model.Farmacias;
import com.pharmaser.bitacora.service.FarmaciasService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/farmacia")
public class FarmaciaController {

    @Autowired
    private FarmaciasService farmaciasService;

    @GetMapping("")
    public List<Farmacias> getAllFarmacias() {
        return farmaciasService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Farmacias> getFarmaciasById(@PathVariable Long id) {
        Farmacias farmacias = farmaciasService.findById(id);
        if (farmacias != null) {
            return ResponseEntity.ok(farmacias);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("")
    public Farmacias createFarmacias(@RequestBody Farmacias farmacias) {
        return farmaciasService.save(farmacias);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Farmacias> updatedFarmacias(
            @PathVariable Long id,
            @RequestBody Farmacias farmaciasDetails) {

        Farmacias updatedFarmacias = farmaciasService.findById(id);

        if (updatedFarmacias != null) {
            updatedFarmacias.setDireccion(farmaciasDetails.getDireccion());
            updatedFarmacias.setNombre(farmaciasDetails.getNombre());
            updatedFarmacias.setCoordenadas(farmaciasDetails.getCoordenadas());
            updatedFarmacias.setCiudad(farmaciasDetails.getCiudad());
            updatedFarmacias.setCanalTransmision(farmaciasDetails.getCanalTransmision());
            updatedFarmacias.setCantidadEquipos(farmaciasDetails.getCantidadEquipos());

            return ResponseEntity.ok(farmaciasService.save(updatedFarmacias));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/softDelete/{id}")
    public ResponseEntity<Void> softDeleteFarmacia(@PathVariable Long id) {
        Farmacias farmacias = farmaciasService.findById(id);
        if (farmacias != null) {
            farmaciasService.softDelete(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
