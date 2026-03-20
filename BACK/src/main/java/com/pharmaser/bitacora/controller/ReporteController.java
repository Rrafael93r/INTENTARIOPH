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
            if (reporte.getFarmacia() == null || reporte.getFarmacia().getId() == 0) {
                throw new RuntimeException("Farmacia es requerida");
            }
            if (reporte.getMotivo() == null || reporte.getMotivo().getId() == 0) {
                throw new RuntimeException("Motivo es requerido");
            }
            if (reporte.getFecha() == null) {
                throw new RuntimeException("Fecha es requerida");
            }
            if (reporte.getFechaHoraInicio() == null) {
                throw new RuntimeException("Fecha y hora de inicio es requerida");
            }
            if (reporte.getEstado() == null || reporte.getEstado().isEmpty()) {
                reporte.setEstado("ABIERTO");
            }
            if (reporte.getIsDeleted() == null) {
                reporte.setIsDeleted(false);
            }

            return reporteService.save(reporte);
        } catch (Exception e) {
            throw new RuntimeException("Error al crear el reporte: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Reporte> updateReporte(
            @PathVariable Long id,
            @RequestBody Reporte reporteDetails) {
        try {
            Reporte reporte = reporteService.findById(id);

            if (reporte != null) {
                if (reporteDetails.getFecha() != null)
                    reporte.setFecha(reporteDetails.getFecha());
                if (reporteDetails.getAno() != null)
                    reporte.setAno(reporteDetails.getAno());
                if (reporteDetails.getMes() != null)
                    reporte.setMes(reporteDetails.getMes());
                if (reporteDetails.getRadicado() != null)
                    reporte.setRadicado(reporteDetails.getRadicado());
                if (reporteDetails.getFarmacia() != null)
                    reporte.setFarmacia(reporteDetails.getFarmacia());
                if (reporteDetails.getFechaHoraInicio() != null)
                    reporte.setFechaHoraInicio(reporteDetails.getFechaHoraInicio());
                if (reporteDetails.getFechaHoraFin() != null)
                    reporte.setFechaHoraFin(reporteDetails.getFechaHoraFin());
                if (reporteDetails.getMotivo() != null)
                    reporte.setMotivo(reporteDetails.getMotivo());
                if (reporteDetails.getObservacion() != null)
                    reporte.setObservacion(reporteDetails.getObservacion());

                if ("CERRADO".equals(reporte.getEstado()) && "ABIERTO".equals(reporteDetails.getEstado())) {
                    if (reporteDetails.getObservacion() == null || reporteDetails.getObservacion().trim().isEmpty()) {
                        throw new RuntimeException("Para reabrir un caso cerrado, debe ingresar una observación.");
                    }
                }

                if (reporteDetails.getEstado() != null && !reporteDetails.getEstado().isEmpty()) {
                    reporte.setEstado(reporteDetails.getEstado());
                }

                // Calcular duración automáticamente si tenemos fecha inicio y fin
                if (reporte.getFechaHoraInicio() != null && reporte.getFechaHoraFin() != null) {
                    try {
                        Timestamp inicio = reporte.getFechaHoraInicio();
                        Timestamp fin = reporte.getFechaHoraFin();
                        long diffMs = fin.getTime() - inicio.getTime();

                        if (diffMs >= 0) {
                            long days = diffMs / (1000 * 60 * 60 * 24);
                            long hours = (diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60);
                            long minutes = (diffMs % (1000 * 60 * 60)) / (1000 * 60);
                            long seconds = (diffMs % (1000 * 60)) / 1000;

                            StringBuilder duracionStr = new StringBuilder();
                            if (days > 0) {
                                duracionStr.append(days).append("d ");
                            }
                            duracionStr.append(String.format("%02d:%02d:%02d", hours, minutes, seconds));
                            if (days > 0) {
                                long totalHours = diffMs / (1000 * 60 * 60);
                                duracionStr.append(" (").append(totalHours).append("h total)");
                            }
                            reporte.setDuracionIncidente(duracionStr.toString());
                        }
                    } catch (Exception ignored) {
                        // Si hay error en el cálculo, mantener la duración existente
                    }
                }

                Reporte updatedReporte = reporteService.save(reporte);
                return ResponseEntity.ok(updatedReporte);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
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
