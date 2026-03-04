package com.pharmaser.bitacora.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity()
@Table(name = "Usuarios")
public class Usuarios {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String username;
    @com.fasterxml.jackson.annotation.JsonProperty(access = com.fasterxml.jackson.annotation.JsonProperty.Access.WRITE_ONLY)
    private String password;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @ManyToOne
    @JoinColumn(name = "role_id")
    private Roles roles;

    // Nueva relación con Farmacias para usuarios reportadores
    @ManyToOne
    @JoinColumn(name = "farmacia_id")
    private Farmacias farmacia;

    @OneToOne
    @JoinColumn(name = "funcionario_id")
    private Funcionarios funcionario;

    @Column(columnDefinition = "boolean default true")
    private Boolean status;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Getters y Setters
    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Roles getRole() {
        return roles;
    }

    public void setRole(Roles roles) {
        this.roles = roles;
    }

    public Farmacias getFarmacia() {
        return farmacia;
    }

    public void setFarmacia(Farmacias farmacia) {
        this.farmacia = farmacia;
    }

    public Funcionarios getFuncionario() {
        return funcionario;
    }

    public void setFuncionario(Funcionarios funcionario) {
        this.funcionario = funcionario;
    }

    public Boolean getStatus() {
        return status;
    }

    public void setStatus(Boolean status) {
        this.status = status;
    }

    @Override
    public String toString() {
        return "Usuarios{" +
                "id=" + id +
                ", username='" + username + '\'' +
                ", farmacia=" + (farmacia != null ? farmacia.getId() : "null") +
                ", role=" + (roles != null ? roles.getId() : "null") +
                ", funcionario=" + (funcionario != null ? funcionario.getId() : "null") +
                ", status=" + status +
                '}';
    }
}
