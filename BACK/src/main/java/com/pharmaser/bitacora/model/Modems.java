package com.pharmaser.bitacora.model;

import jakarta.persistence.*;
import java.math.BigInteger;

@Entity
public class Modems {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String numeroSerie;
    private String marca;
    private String modelo;
    private String estado;
    private BigInteger numero;

    @ManyToOne
    @JoinColumn(name = "ubicacion_modems")
    private Farmacias farmacia;

    @ManyToOne
    @JoinColumn(name = "Operador")
    private ProveedorInternet proveedorInternet;

    private Boolean isDeleted = false;

    // Getters y Setters
    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public Farmacias getFarmacia() {
        return farmacia;
    }

    public void setFarmacia(Farmacias farmacia) {
        this.farmacia = farmacia;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getModelo() {
        return modelo;
    }

    public void setModelo(String modelo) {
        this.modelo = modelo;
    }

    public String getNumeroSerie() {
        return numeroSerie;
    }

    public void setNumeroSerie(String numeroSerie) {
        this.numeroSerie = numeroSerie;
    }

    public String getMarca() {
        return marca;
    }

    public void setMarca(String marca) {
        this.marca = marca;
    }

    public Boolean getIsDeleted() {
        return isDeleted;
    }

    // Corregir el nombre del setter
    public void setIsDeleted(Boolean isDeleted) {
        this.isDeleted = isDeleted;
    }

    public BigInteger getNumero() {
        return numero;
    }

    public void setNumero(BigInteger numero) {
        this.numero = numero;
    }

    public ProveedorInternet getProveedorInternet() {
        return proveedorInternet;
    }

    public void setProveedorInternet(ProveedorInternet proveedorInternet) {
        this.proveedorInternet = proveedorInternet;
    }

    @Override
    public String toString() {
        return "Modems{" +
                "id=" + id +
                ", numero_serie='" + numeroSerie + '\'' +
                ", marca='" + marca + '\'' +
                ", modelo='" + modelo + '\'' +
                ", estado='" + estado + '\'' +
                ", numero=" + numero +
                ", farmacia=" + (farmacia != null ? farmacia.getId() : "null") +
                ", proveedorInternet=" + (proveedorInternet != null ? proveedorInternet.getId() : "null") +
                ", isDeleted=" + isDeleted +
                '}';
    }
}
