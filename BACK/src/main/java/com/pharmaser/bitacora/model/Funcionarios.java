package com.pharmaser.bitacora.model;

import jakarta.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "portatiles", "pcEscritorios", "perifericos", "monitores"})
public class Funcionarios {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String nombre;
    private String apellido;
    @ManyToOne
    @JoinColumn(name = "area_id")
    @com.fasterxml.jackson.annotation.JsonIgnore
    private Areas area;
    private String correo;

    @ManyToOne
    @JoinColumn(name = "Farmacias")
    @com.fasterxml.jackson.annotation.JsonIgnore
    private Farmacias farmacias;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getApellido() {
        return apellido;
    }

    public void setApellido(String apellido) {
        this.apellido = apellido;
    }

    public Areas getArea() {
        return area;
    }

    public void setArea(Areas area) {
        this.area = area;
    }

    public String getCorreo() {
        return correo;
    }

    public void setCorreo(String correo) {
        this.correo = correo;
    }

    public Farmacias getFarmacias() {
        return farmacias;
    }

    public void setFarmacias(Farmacias farmacias) {
        this.farmacias = farmacias;
    }
}
