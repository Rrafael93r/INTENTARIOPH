package com.pharmaser.bitacora.model;

import jakarta.persistence.*;

@Entity
public class Farmacias {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String nombre;
    private String coordenadas;
    private String direccion;
    private String anchoBAnda;

    private Boolean isDeleted = false;

    @ManyToOne
    @JoinColumn(name = "ciudad")
    private Ciudades ciudad;

    private String pertenece;

    @ManyToOne
    @JoinColumn(name = "proveedor")
    private ProveedorInternet proveedorInternet;

    @ManyToOne
    @JoinColumn(name = "canal_transmision")
    private CanalTransmision canalTransmision;

    private int cantidadEquipos;

    public CanalTransmision getCanalTransmision() {
        return canalTransmision;
    }

    public void setCanalTransmision(CanalTransmision canalTransmision) {
        this.canalTransmision = canalTransmision;
    }

    public Ciudades getCiudad() {
        return ciudad;
    }

    public void setCiudad(Ciudades ciudad) {
        this.ciudad = ciudad;
    }

    public ProveedorInternet getProveedor() {
        return proveedorInternet;
    }

    public void setProveedor(ProveedorInternet proveedorInternet) {
        this.proveedorInternet = proveedorInternet;
    }

    public String getPertenece() {
        return pertenece;
    }

    public void setPertenece(String pertenece) {
        this.pertenece = pertenece;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getDireccion() {
        return direccion;
    }

    public void setDireccion(String direccion) {
        this.direccion = direccion;
    }

    public String getCoordenadas() {
        return coordenadas;
    }

    public void setCoordenadas(String coordenadas) {
        this.coordenadas = coordenadas;
    }

    public String getAnchoBAnda() {
        return anchoBAnda;
    }

    public void setAnchoBAnda(String anchoBAnda) {
        this.anchoBAnda = anchoBAnda;
    }

    public ProveedorInternet getProveedorInternet() {
        return proveedorInternet;
    }

    public void setProveedorInternet(ProveedorInternet proveedorInternet) {
        this.proveedorInternet = proveedorInternet;
    }

    public Boolean getIsDeleted() {
        return isDeleted;
    }

    public void setIsDeleted(Boolean isDeleted) {
        this.isDeleted = isDeleted;
    }

    public int getCantidadEquipos() {
        return cantidadEquipos;
    }

    public void setCantidadEquipos(int cantidadEquipos) {
        this.cantidadEquipos = cantidadEquipos;
    }

}