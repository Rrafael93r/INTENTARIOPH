package com.pharmaser.bitacora.model;

import jakarta.persistence.*;
import java.sql.Timestamp;
import java.sql.Date;

@Entity
public class Reporte {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer ano;
    private Integer mes;
    private String radicado;

    @ManyToOne
    @JoinColumn(name = "id_farmacia")
    private Farmacias farmacia;

    @Column(nullable = true)
    private Date fecha;

    @Column(nullable = true)
    private Timestamp fechaHoraInicio;

    @Column(nullable = true)
    private Timestamp fechaHoraFin;

    // Cambiar de Time a String para permitir duraciones mayores a 24 horas
    @Column(nullable = true)
    private String duracionIncidente;

    private String estado;
    private Boolean isDeleted = false;

    @ManyToOne
    @JoinColumn(name = "id_motivo")
    private MotivoReporte motivo;

    private String observacion;

    // Getters y Setters
    public Boolean getIsDeleted() {
        return isDeleted;
    }

    public void setIsDeleted(Boolean isDeleted) {
        this.isDeleted = isDeleted;
    }

    public String getObservacion() {
        return observacion;
    }

    public void setObservacion(String observacion) {
        this.observacion = observacion;
    }

    public MotivoReporte getMotivo() {
        return motivo;
    }

    public void setMotivo(MotivoReporte motivo) {
        this.motivo = motivo;
    }

    public String getRadicado() {
        return radicado;
    }

    public void setRadicado(String radicado) {
        this.radicado = radicado;
    }

    public Integer getMes() {
        return mes;
    }

    public void setMes(Integer mes) {
        this.mes = mes;
    }

    public Integer getAno() {
        return ano;
    }

    public void setAno(Integer ano) {
        this.ano = ano;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Timestamp getFechaHoraInicio() {
        return fechaHoraInicio;
    }

    public void setFechaHoraInicio(Timestamp fechaHoraInicio) {
        this.fechaHoraInicio = fechaHoraInicio;
    }

    public Timestamp getFechaHoraFin() {
        return fechaHoraFin;
    }

    public void setFechaHoraFin(Timestamp fechaHoraFin) {
        this.fechaHoraFin = fechaHoraFin;
    }

    public Date getFecha() {
        return fecha;
    }

    public void setFecha(Date fecha) {
        this.fecha = fecha;
    }

    public Farmacias getFarmacia() {
        return farmacia;
    }

    public void setFarmacia(Farmacias farmacia) {
        this.farmacia = farmacia;
    }

    // Cambiar el tipo de retorno de Time a String
    public String getDuracionIncidente() {
        return duracionIncidente;
    }

    public void setDuracionIncidente(String duracionIncidente) {
        this.duracionIncidente = duracionIncidente;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }
}
