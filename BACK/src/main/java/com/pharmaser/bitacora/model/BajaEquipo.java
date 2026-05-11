package com.pharmaser.bitacora.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
public class BajaEquipo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // PORTATIL, PC_ESCRITORIO, MONITOR, IMPRESORA, IMPRESORA_POS, PERIFERICO, DIADEMA
    private String tipoEquipo;
    private Long equipoId;

    private String serial;
    private String marca;
    private String modelo;

    private String motivoBaja;
    private LocalDate fechaBaja;
    private String descripcion;

    @ManyToOne
    @JoinColumn(name = "ultimo_funcionario_id")
    private Funcionarios ultimoFuncionario;

    @ManyToOne
    @JoinColumn(name = "registrado_por_id")
    private Usuarios registradoPor;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTipoEquipo() { return tipoEquipo; }
    public void setTipoEquipo(String tipoEquipo) { this.tipoEquipo = tipoEquipo; }

    public Long getEquipoId() { return equipoId; }
    public void setEquipoId(Long equipoId) { this.equipoId = equipoId; }

    public String getSerial() { return serial; }
    public void setSerial(String serial) { this.serial = serial; }

    public String getMarca() { return marca; }
    public void setMarca(String marca) { this.marca = marca; }

    public String getModelo() { return modelo; }
    public void setModelo(String modelo) { this.modelo = modelo; }

    public String getMotivoBaja() { return motivoBaja; }
    public void setMotivoBaja(String motivoBaja) { this.motivoBaja = motivoBaja; }

    public LocalDate getFechaBaja() { return fechaBaja; }
    public void setFechaBaja(LocalDate fechaBaja) { this.fechaBaja = fechaBaja; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public Funcionarios getUltimoFuncionario() { return ultimoFuncionario; }
    public void setUltimoFuncionario(Funcionarios ultimoFuncionario) { this.ultimoFuncionario = ultimoFuncionario; }

    public Usuarios getRegistradoPor() { return registradoPor; }
    public void setRegistradoPor(Usuarios registradoPor) { this.registradoPor = registradoPor; }
}
