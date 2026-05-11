package com.pharmaser.bitacora.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
public class Mantenimiento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // PORTATIL, PC_ESCRITORIO, MONITOR, IMPRESORA, IMPRESORA_POS, PERIFERICO, DIADEMA
    private String tipoEquipo;
    private Long equipoId;

    // PREVENTIVO, CORRECTIVO, REPARACION
    private String tipoMantenimiento;

    private String descripcion;
    private LocalDate fecha;

    @ManyToOne
    @JoinColumn(name = "funcionario_id")
    private Funcionarios tecnico;

    private Double costo;

    // EXITOSO, PARCIAL, FALLIDO
    private String resultado;

    private String observaciones;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTipoEquipo() { return tipoEquipo; }
    public void setTipoEquipo(String tipoEquipo) { this.tipoEquipo = tipoEquipo; }

    public Long getEquipoId() { return equipoId; }
    public void setEquipoId(Long equipoId) { this.equipoId = equipoId; }

    public String getTipoMantenimiento() { return tipoMantenimiento; }
    public void setTipoMantenimiento(String tipoMantenimiento) { this.tipoMantenimiento = tipoMantenimiento; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public LocalDate getFecha() { return fecha; }
    public void setFecha(LocalDate fecha) { this.fecha = fecha; }

    public Funcionarios getTecnico() { return tecnico; }
    public void setTecnico(Funcionarios tecnico) { this.tecnico = tecnico; }

    public Double getCosto() { return costo; }
    public void setCosto(Double costo) { this.costo = costo; }

    public String getResultado() { return resultado; }
    public void setResultado(String resultado) { this.resultado = resultado; }

    public String getObservaciones() { return observaciones; }
    public void setObservaciones(String observaciones) { this.observaciones = observaciones; }
}
