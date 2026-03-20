package com.pharmaser.bitacora.model;

import jakarta.persistence.*;

@Entity
public class Departamentos {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nameDepartamento;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNameDepartamento() {
        return nameDepartamento;
    }

    public void setNameDepartamento(String nameDepartamento) {
        this.nameDepartamento = nameDepartamento;
    }
}