package com.pharmaser.bitacora.controller;

import com.pharmaser.bitacora.model.Acta;
import com.pharmaser.bitacora.service.ActaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/actas")
@CrossOrigin(origins = "http://localhost:5173")
public class ActaController {

    @Autowired
    private ActaService service;

    @GetMapping
    public List<Acta> getAllActas() {
        return service.getAllActas();
    }

    @PostMapping
    public Acta createActa(@RequestBody Acta acta) {
        return service.createActa(acta);
    }

    @GetMapping("/{id}")
    public Optional<Acta> getActaById(@PathVariable Long id) {
        return service.getActaById(id);
    }

    @DeleteMapping("/{id}")
    public void deleteActa(@PathVariable Long id) {
        service.deleteActa(id);
    }
}
