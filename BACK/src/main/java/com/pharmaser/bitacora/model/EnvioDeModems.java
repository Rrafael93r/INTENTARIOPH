package com.pharmaser.bitacora.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
public class EnvioDeModems {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_farmacia")
    private Farmacias farmacia;

    @ManyToOne
    @JoinColumn(name = "id_modem_principal")
    private Modems modemPrincipal;

    @ManyToOne
    @JoinColumn(name = "id_modem_secundario")
    private Modems modemSecundario;

    private LocalDateTime fechaEnvio;
    private BigDecimal costoEnvio;
    private String estadoEnvio;

    // Getters y setters
    public Modems getModemPrincipal() {
        return modemPrincipal;
    }

    public void setModemPrincipal(Modems modemPrincipal) {
        this.modemPrincipal = modemPrincipal;
    }

    public Modems getModemSecundario() {
        return modemSecundario;
    }

    public void setModemSecundario(Modems modemSecundario) {
        this.modemSecundario = modemSecundario;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDateTime getFechaEnvio() {
        return fechaEnvio;
    }

    public void setFechaEnvio(LocalDateTime fechaEnvio) {
        this.fechaEnvio = fechaEnvio;
    }

    public BigDecimal getCostoEnvio() {
        return costoEnvio;
    }

    public void setCostoEnvio(BigDecimal costoEnvio) {
        this.costoEnvio = costoEnvio;
    }

    public String getEstadoEnvio() {
        return estadoEnvio;
    }

    public void setEstadoEnvio(String estadoEnvio) {
        this.estadoEnvio = estadoEnvio;
    }

    public Farmacias getFarmacia() {
        return farmacia;
    }

    public void setFarmacia(Farmacias farmacia) {
        this.farmacia = farmacia;
    }
}