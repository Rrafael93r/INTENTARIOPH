    package com.pharmaser.bitacora.model;
    import jakarta.persistence.*;
    import java.util.Date;

    @Entity
    public class ProveedorInternet {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        private String nombre;
        private String nombreContacto;
        private String numeroContacto;
        private String nit;
        private String correo;
        private String estado;

        @Temporal(TemporalType.DATE)
        private Date fechaContratacion; // Corregido: usar minúsculas consistentemente

        private String observacion; // Corregido: usar minúsculas consistentemente
        private Boolean isDeleted = false;

        // Getters y Setters
        public Boolean getIsDeleted() {
            return isDeleted;
        }

        public void setIsDeleted(Boolean isDeleted) {
            this.isDeleted = isDeleted;
        }

        public String getObservacion() {
            return observacion;
        }

        public void setObservacion(String observacion) {
            this.observacion = observacion;
        }

        public Date getFechaContratacion() {
            return fechaContratacion;
        }

        public void setFechaContratacion(Date fechaContratacion) {
            this.fechaContratacion = fechaContratacion;
        }

        public String getNumeroContacto() {
            return numeroContacto;
        }

        public void setNumeroContacto(String numeroContacto) {
            this.numeroContacto = numeroContacto;
        }

        public String getNit() {
            return nit;
        }

        public void setNit(String nit) {
            this.nit = nit;
        }

        public Boolean getDeleted() {
            return isDeleted;
        }

        public void setDeleted(Boolean deleted) {
            isDeleted = deleted;
        }

        public String getNombreContacto() {
            return nombreContacto;
        }

        public void setNombreContacto(String nombreContacto) {
            this.nombreContacto = nombreContacto;
        }

        public String getNombre() {
            return nombre;
        }

        public void setNombre(String nombre) {
            this.nombre = nombre;
        }

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getEstado() {
            return estado;
        }

        public void setEstado(String estado) {
            this.estado = estado;
        }

        public String getCorreo() {
            return correo;
        }

        public void setCorreo(String correo) {
            this.correo = correo;
        }

        @Override
        public String toString() {
            return "ProveedorInternet{" +
                    "id=" + id +
                    ", nombre='" + nombre + '\'' +
                    ", nombre_contacto='" + nombreContacto + '\'' +
                    ", numero_contacto=" + numeroContacto +
                    ", nit=" + nit +
                    ", correo='" + correo + '\'' +
                    ", estado='" + estado + '\'' +
                    ", fecha_contratacion=" + fechaContratacion +
                    ", observacion='" + observacion + '\'' +
                    ", isDeleted=" + isDeleted +
                    '}';
        }
    }
