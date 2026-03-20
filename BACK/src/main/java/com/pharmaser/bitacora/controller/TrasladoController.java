package com.pharmaser.bitacora.controller;

import com.pharmaser.bitacora.model.Traslado;
import com.pharmaser.bitacora.service.TrasladoServicie;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/traslado")
public class TrasladoController {

    @Autowired
    private TrasladoServicie trasladoService;

    // Obtener todos los traslados
    @GetMapping("")
    public List<Traslado> getAllTraslados() {
        return trasladoService.findAll();
    }


    @GetMapping("/{id}")
    public ResponseEntity<Traslado> getTrasladoById(@PathVariable Long id) {
        Traslado traslado = trasladoService.findById(id);
        if (traslado != null) {
            return ResponseEntity.ok(traslado);
        } else {
            return ResponseEntity.notFound().build();
        }
    }


    @PostMapping("")
    public Traslado createTraslado(@RequestBody Traslado traslado) {
        return trasladoService.save(traslado);
    }


    @PutMapping("/{id}")
    public ResponseEntity<Traslado> updateTraslado(
            @PathVariable Long id,
            @RequestBody Traslado trasladoDetails) {

        Traslado traslado = trasladoService.findById(id);

        if (traslado != null) {
            traslado.setFarmacia(trasladoDetails.getFarmacia());
            traslado.setFechaTraslado(trasladoDetails.getFechaTraslado());
            traslado.setMotivoTraslado(trasladoDetails.getMotivoTraslado());
            traslado.setCiudad(trasladoDetails.getCiudad());
            traslado.setProveedor(trasladoDetails.getProveedor());

            Traslado updatedTraslado = trasladoService.save(traslado);
            return ResponseEntity.ok(updatedTraslado);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Eliminar un traslado por ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTraslado(@PathVariable Long id) {
        if (trasladoService.findById(id) != null) {
            trasladoService.delete(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
