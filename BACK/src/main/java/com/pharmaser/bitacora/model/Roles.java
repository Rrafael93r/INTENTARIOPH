package com.pharmaser.bitacora.model;

import jakarta.persistence.*;

import java.util.List;

@Entity()
public class Roles {
    @Id
    @GeneratedValue(
            strategy = GenerationType.IDENTITY
    )
    private Long id;

    private String name;

    @OneToMany(mappedBy = "roles", cascade = CascadeType.ALL)
    private List<Usuarios> usuarios;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
}
