package com.pharmaser.bitacora.model;

import jakarta.persistence.*;

@Entity
public class Monitores {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @ManyToOne
    @JoinColumn(name = "marca_id")
    private Marcas marca;

    private String Modelo;
    private String Serial;

    private String Estado;
    private String Fecha_compra;

    @ManyToOne
    @JoinColumn(name = "funcionario_id")
    private Funcionarios funcionario;

    private String Descripcion;

    public String getDescripcion() {
        return Descripcion;
    }

    public void setDescripcion(String descripcion) {
        Descripcion = descripcion;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public Funcionarios getFuncionario() {
        return funcionario;
    }

    public void setFuncionario(Funcionarios funcionario) {
        this.funcionario = funcionario;
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

    public Marcas getMarca() {
        return marca;
    }

    public void setMarca(Marcas marca) {
        this.marca = marca;
    }

    public String getModelo() {
        return Modelo;
    }

    public void setModelo(String modelo) {
        Modelo = modelo;
    }

    public String getFecha_compra() {
        return Fecha_compra;
    }

    public void setFecha_compra(String fecha_compra) {
        Fecha_compra = fecha_compra;
    }
}
