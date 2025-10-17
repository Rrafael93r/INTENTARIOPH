    package com.pharmaser.bitacora.model;
    import jakarta.persistence.*;
    import java.util.Date;

    @Entity
    public class ProveedorInternet {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private long id;

        private String nombre;
        private String nombre_contacto;
        private String numero_contacto;
        private String nit;
        private String correo;
        private String estado;

        @Temporal(TemporalType.DATE)
        private Date fecha_contratacion; // Corregido: usar minúsculas consistentemente

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

        public Date getFecha_contratacion() {
            return fecha_contratacion;
        }

        public void setFecha_contratacion(Date fecha_contratacion) {
            this.fecha_contratacion = fecha_contratacion;
        }

        public String getNumero_contacto() {
            return numero_contacto;
        }

        public void setNumero_contacto(String numero_contacto) {
            this.numero_contacto = numero_contacto;
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

        public String getNombre_contacto() {
            return nombre_contacto;
        }

        public void setNombre_contacto(String nombre_contacto) {
            this.nombre_contacto = nombre_contacto;
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
                    ", nombre_contacto='" + nombre_contacto + '\'' +
                    ", numero_contacto=" + numero_contacto +
                    ", nit=" + nit +
                    ", correo='" + correo + '\'' +
                    ", estado='" + estado + '\'' +
                    ", fecha_contratacion=" + fecha_contratacion +
                    ", observacion='" + observacion + '\'' +
                    ", isDeleted=" + isDeleted +
                    '}';
        }
    }
