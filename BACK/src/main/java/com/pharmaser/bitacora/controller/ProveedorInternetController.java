package com.pharmaser.bitacora.controller;

import com.pharmaser.bitacora.model.ProveedorInternet;
import com.pharmaser.bitacora.service.ProveedorInternetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/proveedorinternet")
public class ProveedorInternetController {

    @Autowired
    private ProveedorInternetService proveedorInternetService;

    @GetMapping("")
    public List<ProveedorInternet> getAllProveedorInternet() {
        return proveedorInternetService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProveedorInternet> getProveedorInternetById(@PathVariable Long id) {
        ProveedorInternet proveedorInternet = proveedorInternetService.findById(id);
        if (proveedorInternet != null) {
            return ResponseEntity.ok(proveedorInternet);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("")
    public ResponseEntity<ProveedorInternet> createProveedorInternet(@RequestBody ProveedorInternet proveedorInternet) {
        try {
            System.out.println("=== CREANDO NUEVO PROVEEDOR ===");
            System.out.println("Datos recibidos: " + proveedorInternet.toString());

            // Validaciones básicas
            if (proveedorInternet.getNombre() == null || proveedorInternet.getNombre().trim().isEmpty()) {
                throw new RuntimeException("El nombre es requerido");
            }
            if (proveedorInternet.getNit() == null) {
                throw new RuntimeException("El NIT es requerido");
            }

            // Establecer valores por defecto
            if (proveedorInternet.getEstado() == null || proveedorInternet.getEstado().trim().isEmpty()) {
                proveedorInternet.setEstado("ACTIVO");
            }
            if (proveedorInternet.getIsDeleted() == null) {
                proveedorInternet.setIsDeleted(false);
            }

            ProveedorInternet savedProveedor = proveedorInternetService.save(proveedorInternet);
            System.out.println("Proveedor creado con ID: " + savedProveedor.getId());
            return ResponseEntity.ok(savedProveedor);

        } catch (Exception e) {
            System.err.println("Error al crear proveedor: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Error al crear el proveedor: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProveedorInternet> updateProveedorInternet(
            @PathVariable Long id,
            @RequestBody ProveedorInternet proveedorInternetDetails) {

        try {
            System.out.println("=== ACTUALIZANDO PROVEEDOR ID: " + id + " ===");
            System.out.println("Datos recibidos: " + proveedorInternetDetails.toString());

            ProveedorInternet proveedorInternet = proveedorInternetService.findById(id);

            if (proveedorInternet != null) {
                // Actualizar todos los campos
                if (proveedorInternetDetails.getNombre() != null) {
                    proveedorInternet.setNombre(proveedorInternetDetails.getNombre());
                }
                if (proveedorInternetDetails.getNit() != null) {
                    proveedorInternet.setNit(proveedorInternetDetails.getNit());
                }
                if (proveedorInternetDetails.getNombre_contacto() != null) {
                    proveedorInternet.setNombre_contacto(proveedorInternetDetails.getNombre_contacto());
                }
                if (proveedorInternetDetails.getNumero_contacto() != null) {
                    proveedorInternet.setNumero_contacto(proveedorInternetDetails.getNumero_contacto());
                }
                if (proveedorInternetDetails.getCorreo() != null) {
                    proveedorInternet.setCorreo(proveedorInternetDetails.getCorreo());
                }
                if (proveedorInternetDetails.getEstado() != null) {
                    proveedorInternet.setEstado(proveedorInternetDetails.getEstado());
                }
                if (proveedorInternetDetails.getFecha_contratacion() != null) {
                    proveedorInternet.setFecha_contratacion(proveedorInternetDetails.getFecha_contratacion());
                }
                if (proveedorInternetDetails.getObservacion() != null) {
                    proveedorInternet.setObservacion(proveedorInternetDetails.getObservacion());
                }

                ProveedorInternet updatedProveedorInternet = proveedorInternetService.save(proveedorInternet);
                System.out.println("Proveedor actualizado exitosamente");
                return ResponseEntity.ok(updatedProveedorInternet);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            System.err.println("Error al actualizar proveedor: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Error al actualizar el proveedor: " + e.getMessage());
        }
    }

    @PutMapping("/softDelete/{id}")
    public ResponseEntity<Void> softDeleteProveedorInternet(@PathVariable Long id) {
        ProveedorInternet proveedorInternet = proveedorInternetService.findById(id);
        if (proveedorInternet != null) {
            proveedorInternetService.softDelete(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
