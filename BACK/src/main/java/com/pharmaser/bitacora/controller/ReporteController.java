package com.pharmaser.bitacora.controller;

import com.pharmaser.bitacora.model.Reporte;
import com.pharmaser.bitacora.service.ReporteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.Timestamp;
import java.util.List;

@RestController
@RequestMapping("/api/reporte")
public class ReporteController {

    @Autowired
    private ReporteService reporteService;

    @GetMapping("")
    public List<Reporte> getAllReportes() {
        return reporteService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Reporte> getReporteById(@PathVariable Long id) {
        Reporte reporte = reporteService.findById(id);
        if (reporte != null) {
            return ResponseEntity.ok(reporte);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("")
    public Reporte createReporte(@RequestBody Reporte reporte) {
        try {
            System.out.println("=== CREANDO NUEVO REPORTE ===");
            System.out.println("Datos recibidos: " + reporte.toString());
            System.out.println("Fecha: " + reporte.getFecha());
            System.out.println("Año: " + reporte.getAno());
            System.out.println("Mes: " + reporte.getMes());
            System.out.println("Estado: " + reporte.getEstado());
            System.out.println(
                    "Farmacia ID: " + (reporte.getFarmacia() != null ? reporte.getFarmacia().getId() : "null"));
            System.out.println("Motivo ID: " + (reporte.getMotivo() != null ? reporte.getMotivo().getId() : "null"));
            System.out.println("Fecha hora inicio: " + reporte.getFecha_hora_inicio());
            System.out.println("Observacion: " + reporte.getObservacion());
            System.out.println("isDeleted: " + reporte.getIsDeleted());
            System.out.println("================================");

            // Validaciones básicas
            if (reporte.getFarmacia() == null || reporte.getFarmacia().getId() == 0) {
                throw new RuntimeException("Farmacia es requerida");
            }
            if (reporte.getMotivo() == null || reporte.getMotivo().getId() == 0) {
                throw new RuntimeException("Motivo es requerido");
            }
            if (reporte.getFecha() == null) {
                throw new RuntimeException("Fecha es requerida");
            }
            if (reporte.getFecha_hora_inicio() == null) {
                throw new RuntimeException("Fecha y hora de inicio es requerida");
            }

            // Establecer valores por defecto si no vienen
            if (reporte.getEstado() == null || reporte.getEstado().isEmpty()) {
                reporte.setEstado("ABIERTO");
            }
            if (reporte.getIsDeleted() == null) {
                reporte.setIsDeleted(false);
            }

            Reporte savedReporte = reporteService.save(reporte);
            System.out.println("Reporte guardado con ID: " + savedReporte.getId());
            return savedReporte;
        } catch (Exception e) {
            System.err.println("Error al crear reporte: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Error al crear el reporte: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Reporte> updateReporte(
            @PathVariable Long id,
            @RequestBody Reporte reporteDetails) {

        try {
            System.out.println("=== ACTUALIZANDO REPORTE ID: " + id + " ===");
            System.out.println("Estado recibido: " + reporteDetails.getEstado());
            System.out.println("Observacion recibida: " + reporteDetails.getObservacion());
            System.out.println("Fecha hora fin recibida: " + reporteDetails.getFecha_hora_fin());

            Reporte reporte = reporteService.findById(id);

            if (reporte != null) {
                // Actualizar campos básicos
                if (reporteDetails.getFecha() != null) {
                    reporte.setFecha(reporteDetails.getFecha());
                }
                if (reporteDetails.getAno() != null) {
                    reporte.setAno(reporteDetails.getAno());
                }
                if (reporteDetails.getMes() != null) {
                    reporte.setMes(reporteDetails.getMes());
                }
                if (reporteDetails.getRadicado() != null) {
                    reporte.setRadicado(reporteDetails.getRadicado());
                }
                if (reporteDetails.getFarmacia() != null) {
                    reporte.setFarmacia(reporteDetails.getFarmacia());
                }
                if (reporteDetails.getFecha_hora_inicio() != null) {
                    reporte.setFecha_hora_inicio(reporteDetails.getFecha_hora_inicio());
                }
                if (reporteDetails.getFecha_hora_fin() != null) {
                    reporte.setFecha_hora_fin(reporteDetails.getFecha_hora_fin());
                }
                if (reporteDetails.getMotivo() != null) {
                    reporte.setMotivo(reporteDetails.getMotivo());
                }
                if (reporteDetails.getObservacion() != null) {
                    reporte.setObservacion(reporteDetails.getObservacion());
                }

                // Validación para reabrir caso
                if ("CERRADO".equals(reporte.getEstado()) && "ABIERTO".equals(reporteDetails.getEstado())) {
                    if (reporteDetails.getObservacion() == null || reporteDetails.getObservacion().trim().isEmpty()) {
                        throw new RuntimeException("Para reabrir un caso cerrado, debe ingresar una observación.");
                    }
                }

                // IMPORTANTE: Actualizar el estado
                if (reporteDetails.getEstado() != null && !reporteDetails.getEstado().isEmpty()) {
                    System.out.println("Actualizando estado de '" + reporte.getEstado() + "' a '"
                            + reporteDetails.getEstado() + "'");
                    reporte.setEstado(reporteDetails.getEstado());
                }

                // Calcular duración automáticamente si tenemos fecha inicio y fin
                if (reporte.getFecha_hora_inicio() != null && reporte.getFecha_hora_fin() != null) {
                    try {
                        Timestamp inicio = reporte.getFecha_hora_inicio();
                        Timestamp fin = reporte.getFecha_hora_fin();

                        // Calcular la diferencia en milisegundos
                        long diffMs = fin.getTime() - inicio.getTime();

                        if (diffMs >= 0) {
                            // Calcular días, horas, minutos y segundos
                            long days = diffMs / (1000 * 60 * 60 * 24);
                            long hours = (diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60);
                            long minutes = (diffMs % (1000 * 60 * 60)) / (1000 * 60);
                            long seconds = (diffMs % (1000 * 60)) / 1000;

                            // Crear string de duración que puede manejar más de 24 horas
                            StringBuilder duracionStr = new StringBuilder();

                            if (days > 0) {
                                duracionStr.append(days).append("d ");
                            }

                            duracionStr.append(String.format("%02d:%02d:%02d", hours, minutes, seconds));

                            // Si hay días, también agregar el total de horas para referencia
                            if (days > 0) {
                                long totalHours = diffMs / (1000 * 60 * 60);
                                duracionStr.append(" (").append(totalHours).append("h total)");
                            }

                            reporte.setDuracion_incidente(duracionStr.toString());
                            System.out.println("Duración calculada: " + duracionStr.toString());
                        }
                    } catch (Exception e) {
                        System.err.println("Error calculando duración: " + e.getMessage());
                        // Si hay error en el cálculo, mantener la duración existente
                    }
                }

                Reporte updatedReporte = reporteService.save(reporte);
                System.out.println("Reporte actualizado exitosamente. Estado final: " + updatedReporte.getEstado());
                return ResponseEntity.ok(updatedReporte);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            System.err.println("Error al actualizar reporte: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Error al actualizar el reporte: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReporte(@PathVariable Long id) {
        if (reporteService.findById(id) != null) {
            reporteService.delete(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
