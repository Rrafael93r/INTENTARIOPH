package com.pharmaser.bitacora.model;

import jakarta.persistence.*;

@Entity
public class HubUsb {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String Marca;
    private String Modelo;
    private String Serial;

    private String Estado;
    private String Fecha_compra;


    @OneToOne(mappedBy = "hubUsb")
    private Funcionarios funcionarios;

    private String Descripcion;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getDescripcion() {
        return Descripcion;
    }

    public void setDescripcion(String descripcion) {
        Descripcion = descripcion;
    }

    public String getEstado() {
        return Estado;
    }

    public void setEstado(String estado) {
        Estado = estado;
    }

    public String getSerial() {
        return Serial;
    }

    public void setSerial(String serial) {
        Serial = serial;
    }

    public String getModelo() {
        return Modelo;
    }

    public void setModelo(String modelo) {
        Modelo = modelo;
    }

    public String getMarca() {
        return Marca;
    }

    public void setMarca(String marca) {
        Marca = marca;
    }

    public String getFecha_compra() {
        return Fecha_compra;
    }

    public void setFecha_compra(String fecha_compra) {
        Fecha_compra = fecha_compra;
    }

    public Funcionarios getFuncionarios() {
        return funcionarios;
    }

    public void setFuncionarios(Funcionarios funcionarios) {
        this.funcionarios = funcionarios;
    }
}
