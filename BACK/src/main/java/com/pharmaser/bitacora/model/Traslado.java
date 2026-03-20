package com.pharmaser.bitacora.model;

import jakarta.persistence.*;
import java.security.Timestamp;



@Entity
public class Traslado {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne // Relación con Farmacias
    @JoinColumn(name = "id_farmacia")
    private Farmacias farmacia;

    private Timestamp fechaTraslado;
    private String motivoTraslado;



    @ManyToOne // Relación con Ciudades
    @JoinColumn(name = "id_ciudad")
    private Ciudades ciudad;


    @ManyToOne
    @JoinColumn(name = "id_proveedor")
    private ProveedorInternet proveedorInternet;

    public Ciudades getCiudad() {
        return ciudad;
    }

    public void setCiudad(Ciudades ciudad) {
        this.ciudad = ciudad;
    }

    public Farmacias getFarmacia() {
        return farmacia;
    }

    public void setFarmacia(Farmacias farmacia) {
        this.farmacia = farmacia;
    }

    public Timestamp getFechaTraslado() {
        return fechaTraslado;
    }

    public void setFechaTraslado(Timestamp fechaTraslado) {
        this.fechaTraslado = fechaTraslado;
    }

    public String getMotivoTraslado() {
        return motivoTraslado;
    }

    public void setMotivoTraslado(String motivoTraslado) {
        this.motivoTraslado = motivoTraslado;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ProveedorInternet getProveedor() {
        return proveedorInternet;
    }

    public void setProveedor(ProveedorInternet proveedorInternet) {
        this.proveedorInternet = proveedorInternet;
    }
}