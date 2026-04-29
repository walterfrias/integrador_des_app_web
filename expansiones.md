# Trabajo Final Integrador — Expansiones y Estado del Sistema

**Sistema:** Gestión de Proyectos
**Materia:** Desarrollo de Aplicaciones Web — UNER 2026
**Stack:** NestJS · TypeORM · PostgreSQL · Angular · nginx · PM2

---

## Enunciado

La consultora en la que se realiza la pasantía ha decidido iniciar el desarrollo de un sistema de gestión de proyectos que tiene como objetivo principal destacar por su simplicidad.

El sistema permite gestionar proyectos, los clientes a los que pertenecen, y las tareas que los componen. Todos los proyectos, clientes y tareas son visibles para todos los usuarios registrados en la instalación — no existe propiedad individual sobre los registros.

---

## Requerimientos base — Estado actual

### Leyenda

| Símbolo | Significado |
|---------|-------------|
| ✅ | Implementado (backend y frontend) |
| ⚙️ | Backend implementado, frontend pendiente |
| 🔧 | Endpoint definido, lógica pendiente (stub) |
| ❌ | Sin implementar |

---

### Acceso

| ID | Descripción | Estado |
|----|-------------|--------|
| RF01 | Autenticar usuario con nombre y clave. Solo usuarios Activos pueden ingresar. | ⚙️ |

---

### Gestión de proyectos

| ID | Descripción | Estado |
|----|-------------|--------|
| RF02 | Listar todos los proyectos con nombre, estado e indicador de retraso. | 🔧 |
| RF03 | Crear proyecto con nombre, estado, fecha límite opcional y cliente opcional (solo Activo). | 🔧 |
| RF04 | Modificar nombre, estado, fecha límite y cliente de un proyecto existente. | 🔧 |
| RF05 | Ver detalle de un proyecto: cliente asociado, fecha límite y lista de tareas. | 🔧 |

---

### Gestión de clientes

| ID | Descripción | Estado |
|----|-------------|--------|
| RF06 | Listar todos los clientes con nombre y estado. | ⚙️ |
| RF07 | Crear cliente con nombre y estado. | ⚙️ |
| RF08 | Modificar nombre, estado y datos de contacto de un cliente. | ⚙️ |
| RF09 | Dar de baja un cliente, solo si no está asociado a ningún proyecto (R02). | 🔧 |

---

### Gestión de tareas

| ID | Descripción | Estado |
|----|-------------|--------|
| RF10 | Agregar tarea a un proyecto existente con descripción y estado. | 🔧 |
| RF11 | Modificar descripción y estado de una tarea. | 🔧 |
| RF12 | Eliminar una tarea de un proyecto. | ❌ |

---

### Restricciones base

| ID | Descripción | Estado |
|----|-------------|--------|
| R01 | Solo se puede asignar a un proyecto un cliente en estado Activo. | ❌ Sin validar |
| R02 | Solo se puede dar de baja un cliente si no está en ningún proyecto. | ❌ Sin validar |
| R03 | Todos los proyectos, clientes y tareas son visibles para todos los usuarios. | ✅ |
| R04 | Los usuarios no son propietarios de los registros creados. | ✅ |

---

## Expansiones implementadas

La cátedra sugiere funcionalidades adicionales para enriquecer el sistema. A continuación se listan las expansiones seleccionadas por el equipo y su estado actual.

---

### E01 — Configuración de roles (RF13–RF16)

Limita ciertas funcionalidades a usuarios con rol Admin: gestión de usuarios, baja de proyectos y tareas.

| ID | Descripción | Estado |
|----|-------------|--------|
| RF13 | Listar usuarios (solo Admin). | ⚙️ |
| RF14 | Crear usuario con nombre, clave, rol y estado (solo Admin). | ⚙️ |
| RF15 | Modificar usuario existente (solo Admin). | ⚙️ |
| RF16 | Dar de baja usuario. No puede darse de baja a sí mismo (solo Admin). | ⚙️ |

**Restricciones adicionales:**

| ID | Descripción | Estado |
|----|-------------|--------|
| R05 | Solo Admin puede gestionar usuarios. | ✅ |
| R06 | Solo Admin puede dar de baja proyectos y tareas. | ✅ |
| R07 | Un usuario no puede darse de baja a sí mismo. | ✅ |

---

### E02 — Búsqueda avanzada (RF17–RF19)

Filtrado, ordenamiento y paginación de tablas según nombre, estado u otros criterios.

| ID | Descripción | Estado |
|----|-------------|--------|
| RF17 | Filtrar y paginar proyectos por nombre y/o estado, con ordenamiento por columna. | ❌ |
| RF18 | Filtrar y paginar clientes por nombre y/o estado, con ordenamiento por columna. | ❌ |
| RF19 | Filtrar y paginar tareas de un proyecto por estado, con ordenamiento por columna. | ❌ |

---

### E03 — Estadísticas (RF20)

Visualización de métricas del sistema en un dashboard.

| ID | Descripción | Estado |
|----|-------------|--------|
| RF20 | Dashboard con: proyectos activos, tareas pendientes, clientes activos y proyectos por cliente. | ❌ |

---

### E04 — Panel visual de tareas / Kanban (RF21)

Visualización de tareas como tarjetas agrupadas por estado dentro del detalle de un proyecto.

| ID | Descripción | Estado |
|----|-------------|--------|
| RF21 | Panel Kanban con columnas Pendiente / Finalizada / Baja dentro del detalle de proyecto. | ❌ |

---

### E05 — Fecha de finalización de proyecto (RF22)

Definición de una fecha límite por proyecto con indicador visual de retraso.

| ID | Descripción | Estado |
|----|-------------|--------|
| RF22 | Mostrar en el listado de proyectos cuáles superaron su fecha límite sin estar finalizados. | ❌ |

**Restricción adicional:**

| ID | Descripción | Estado |
|----|-------------|--------|
| R08 | La fecha límite, si se define, debe ser posterior a la fecha de creación del proyecto. | ❌ Sin validar |

---

### E06 — Contacto de clientes (RF23–RF25)

Registro de teléfonos y correos electrónicos asociados a cada cliente.

| ID | Descripción | Estado |
|----|-------------|--------|
| RF23 | Agregar dato de contacto (teléfono o email) a un cliente. | ❌ |
| RF24 | Modificar un dato de contacto existente de un cliente. | ❌ |
| RF25 | Eliminar un dato de contacto de un cliente. | ❌ |

---

### E07 — Exportación CSV (RF26–RF27)

Descarga de listados en formato CSV desde el frontend.

| ID | Descripción | Estado |
|----|-------------|--------|
| RF26 | Exportar listado de proyectos (con estado y cliente) a CSV. | ❌ |
| RF27 | Exportar listado de tareas de un proyecto a CSV. | ❌ |

---

## Expansiones sugeridas no incorporadas

Las siguientes expansiones fueron propuestas por la cátedra pero no fueron seleccionadas por el equipo para esta entrega:

- **Historial de cambios:** registrar cada modificación con usuario y fecha.
- **Gestión de metas intermedias:** metas dentro de un proyecto con tareas asociadas.
