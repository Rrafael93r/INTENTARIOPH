-- ============================================================
-- MIGRACIÓN v2 — Módulos: Mantenimiento + BajaEquipo
-- Base de datos: bitacora_bd
-- Fecha: 2026-05-11
-- Autor: R.R.R.
-- ============================================================

USE bitacora_bd;

-- ------------------------------------------------------------
-- 1. Tabla mantenimiento
--    Historial de mantenimientos y reparaciones de activos TIC
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS mantenimiento (
    id                  BIGINT AUTO_INCREMENT PRIMARY KEY,
    tipo_equipo         VARCHAR(30)    NOT NULL COMMENT 'PORTATIL|PC_ESCRITORIO|MONITOR|IMPRESORA|IMPRESORA_POS|PERIFERICO|DIADEMA',
    equipo_id           BIGINT         NOT NULL COMMENT 'ID del registro en su tabla de origen',
    tipo_mantenimiento  VARCHAR(20)    NOT NULL COMMENT 'PREVENTIVO|CORRECTIVO|REPARACION',
    descripcion         TEXT           NOT NULL,
    fecha               DATE           NOT NULL,
    funcionario_id      BIGINT         NULL COMMENT 'Técnico responsable (FK a funcionarios)',
    costo               DECIMAL(12,2)  NULL,
    resultado           VARCHAR(15)    NOT NULL DEFAULT 'EXITOSO' COMMENT 'EXITOSO|PARCIAL|FALLIDO',
    observaciones       TEXT           NULL,
    CONSTRAINT fk_mant_funcionario FOREIGN KEY (funcionario_id) REFERENCES funcionarios(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 2. Tabla baja_equipo
--    Registro de activos tecnológicos dados de baja
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS baja_equipo (
    id                      BIGINT AUTO_INCREMENT PRIMARY KEY,
    tipo_equipo             VARCHAR(30)  NOT NULL COMMENT 'PORTATIL|PC_ESCRITORIO|MONITOR|IMPRESORA|IMPRESORA_POS|PERIFERICO|DIADEMA',
    equipo_id               BIGINT       NULL  COMMENT 'ID original del activo (puede ser NULL si ya fue eliminado)',
    serial                  VARCHAR(100) NULL,
    marca                   VARCHAR(100) NULL,
    modelo                  VARCHAR(100) NULL,
    motivo_baja             VARCHAR(200) NOT NULL,
    fecha_baja              DATE         NOT NULL,
    descripcion             TEXT         NULL,
    ultimo_funcionario_id   BIGINT       NULL COMMENT 'FK a funcionarios',
    registrado_por_id       BIGINT       NULL COMMENT 'FK a usuarios',
    CONSTRAINT fk_baja_funcionario  FOREIGN KEY (ultimo_funcionario_id) REFERENCES funcionarios(id) ON DELETE SET NULL,
    CONSTRAINT fk_baja_usuario      FOREIGN KEY (registrado_por_id)     REFERENCES usuarios(id)     ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 3. Índices útiles para consultas frecuentes
-- ------------------------------------------------------------
CREATE INDEX idx_mant_tipo_equipo  ON mantenimiento (tipo_equipo, equipo_id);
CREATE INDEX idx_mant_fecha        ON mantenimiento (fecha);
CREATE INDEX idx_baja_tipo_equipo  ON baja_equipo   (tipo_equipo);
CREATE INDEX idx_baja_fecha        ON baja_equipo   (fecha_baja);

-- ============================================================
-- FIN DE MIGRACIÓN v2
-- ============================================================
