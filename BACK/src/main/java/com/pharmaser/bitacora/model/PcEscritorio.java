package com.pharmaser.bitacora.model;

import jakarta.persistence.*;

@Entity
public class PcEscritorio {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @ManyToOne
    @JoinColumn(name = "marca_id")
    private Marcas marca;

    private String Modelo;
    private String Serial;
    @ManyToOne
    @JoinColumn(name = "estado_id")
    private Estado estado;

    private String Fecha_compra;
    private String Descripcion;

    @ManyToOne
    @JoinColumn(name = "funcionario_id")
    private Funcionarios funcionario;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
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

    public String getSerial() {
        return Serial;
    }

    public void setSerial(String serial) {
        Serial = serial;
    }

    public Estado getEstado() {
        return estado;
    }

    public void setEstado(Estado estado) {
        this.estado = estado;
    }

    public String getFecha_compra() {
        return Fecha_compra;
    }

    public void setFecha_compra(String fecha_compra) {
        Fecha_compra = fecha_compra;
    }

    public String getDescripcion() {
        return Descripcion;
    }

    public void setDescripcion(String descripcion) {
        Descripcion = descripcion;
    }

    public Funcionarios getFuncionario() {
        return funcionario;
    }

    public void setFuncionario(Funcionarios funcionario) {
        this.funcionario = funcionario;
    }
}
