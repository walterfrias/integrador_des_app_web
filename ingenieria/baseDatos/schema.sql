-- ============================================================
-- Sistema: Gestión de Proyectos
-- Materia: Ingeniería de Software — UNER
-- ============================================================

-- ------------------------------------------------------------
-- TIPOS ENUMERADOS
-- ------------------------------------------------------------

CREATE TYPE roles_usuarios    AS ENUM ('ADMIN', 'OPERADOR');
CREATE TYPE estados_usuarios  AS ENUM ('ACTIVO', 'BAJA');
CREATE TYPE estados_clientes  AS ENUM ('ACTIVO', 'BAJA');
CREATE TYPE estados_proyectos AS ENUM ('ACTIVO', 'FINALIZADO', 'BAJA');
CREATE TYPE estados_tareas    AS ENUM ('PENDIENTE', 'FINALIZADA', 'BAJA');
CREATE TYPE tipos_contacto    AS ENUM ('TELEFONO', 'EMAIL');

-- ------------------------------------------------------------
-- TABLAS
-- ------------------------------------------------------------

CREATE TABLE usuarios (
    id     SERIAL PRIMARY KEY,
    nombre TEXT              NOT NULL UNIQUE,
    clave  TEXT              NOT NULL,
    rol    roles_usuarios    NOT NULL DEFAULT 'OPERADOR',
    estado estados_usuarios  NOT NULL DEFAULT 'ACTIVO'
);

CREATE TABLE clientes (
    id     SERIAL PRIMARY KEY,
    nombre TEXT             NOT NULL UNIQUE,
    estado estados_clientes NOT NULL DEFAULT 'ACTIVO'
);

CREATE TABLE contactos_clientes (
    id         SERIAL PRIMARY KEY,
    id_cliente INT            NOT NULL,
    tipo       tipos_contacto NOT NULL,
    valor      TEXT           NOT NULL,
    CONSTRAINT fk_contactos_cliente
        FOREIGN KEY (id_cliente)
        REFERENCES clientes (id)
        ON DELETE CASCADE
);

CREATE TABLE proyectos (
    id          SERIAL PRIMARY KEY,
    nombre      TEXT              NOT NULL UNIQUE,
    estado      estados_proyectos NOT NULL DEFAULT 'ACTIVO',
    fecha_limite DATE,
    id_cliente  INT,
    CONSTRAINT fk_proyectos_cliente
        FOREIGN KEY (id_cliente)
        REFERENCES clientes (id)
);

CREATE TABLE tareas (
    id          SERIAL PRIMARY KEY,
    descripcion TEXT           NOT NULL,
    estado      estados_tareas NOT NULL DEFAULT 'PENDIENTE',
    id_proyecto INT            NOT NULL,
    CONSTRAINT fk_tareas_proyecto
        FOREIGN KEY (id_proyecto)
        REFERENCES proyectos (id)
        ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- ÍNDICES
-- ------------------------------------------------------------

CREATE INDEX idx_proyectos_estado    ON proyectos (estado);
CREATE INDEX idx_proyectos_cliente   ON proyectos (id_cliente);
CREATE INDEX idx_tareas_proyecto     ON tareas (id_proyecto);
CREATE INDEX idx_tareas_estado       ON tareas (estado);
CREATE INDEX idx_contactos_cliente   ON contactos_clientes (id_cliente);

-- ------------------------------------------------------------
-- DATOS INICIALES
-- ------------------------------------------------------------

CREATE EXTENSION IF NOT EXISTS pgcrypto;

INSERT INTO usuarios (nombre, clave, rol, estado)
VALUES ('admin', crypt('admin123', gen_salt('bf', 10)), 'ADMIN', 'ACTIVO');

INSERT INTO usuarios (nombre, clave, rol, estado)
VALUES ('usuario', crypt('clave', gen_salt('bf', 10)), 'OPERADOR', 'ACTIVO');
