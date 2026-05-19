# Estado de Requerimientos — Sistema de Gestión de Proyectos
**UNER — Ingeniería de Software**  
**Fecha:** 19/05/2026

---

## Requerimientos Base

| RF | Descripción | Estado |
|---|---|---|
| RF01 | Autenticar usuario (JWT, login por email) | ✅ Completo |
| RF02 | Listar proyectos | ❌ Pendiente |
| RF03 | Crear proyecto | ❌ Pendiente |
| RF04 | Modificar proyecto | ❌ Pendiente |
| RF05 | Ver detalle de proyecto | ❌ Pendiente |
| RF06 | Listar clientes | ✅ Completo |
| RF07 | Crear cliente (nombre, cuit, dirección) | ✅ Completo |
| RF08 | Modificar cliente | ✅ Completo |
| RF09 | Dar de baja cliente (validar R02) | ✅ Completo |
| RF10 | Agregar tarea | ❌ Pendiente |
| RF11 | Modificar tarea | ❌ Pendiente |
| RF12 | Eliminar tarea | ❌ Pendiente |

## E01 — Gestión de usuarios y roles

| RF | Descripción | Estado |
|---|---|---|
| RF13 | Listar usuarios (nombre, email, rol) | ✅ Completo |
| RF14 | Crear usuario (apellido, email, cuil) | ✅ Completo |
| RF15 | Modificar usuario | ✅ Completo |
| RF16 | Dar de baja usuario | ✅ Completo |

## E02 — Búsqueda avanzada

| RF | Descripción | Estado |
|---|---|---|
| RF17 | Filtrar/paginar proyectos | ❌ Pendiente |
| RF18 | Filtrar/paginar clientes | ❌ Pendiente |
| RF19 | Filtrar/paginar tareas | ❌ Pendiente |

## E03 — Estadísticas

| RF | Descripción | Estado |
|---|---|---|
| RF20 | Estadísticas dashboard | ✅ Completo |

## E04 — Panel Kanban

| RF | Descripción | Estado |
|---|---|---|
| RF21 | Panel Kanban de tareas | ❌ Pendiente |

## E05 — Fecha de finalización

| RF | Descripción | Estado |
|---|---|---|
| RF22 | Visualizar proyectos retrasados | ⚠️ Parcial (dato en dashboard, falta listado) |

## E06 — Contacto de clientes

| RF | Descripción | Estado |
|---|---|---|
| RF23 | Agregar contacto a cliente | ❌ Pendiente |
| RF24 | Modificar contacto de cliente | ❌ Pendiente |
| RF25 | Eliminar contacto de cliente | ❌ Pendiente |

## E07 — Exportación CSV

| RF | Descripción | Estado |
|---|---|---|
| RF26 | Exportar proyectos a CSV | ❌ Pendiente |
| RF27 | Exportar tareas a CSV | ❌ Pendiente |

## E08 — Asignación de usuarios a proyectos

| RF | Descripción | Estado |
|---|---|---|
| RF28 | Asignar usuario a proyecto | ⚠️ Parcial (backend completo, falta frontend) |
| RF29 | Listar asignaciones | ⚠️ Parcial (backend completo, falta frontend) |
| RF30 | Dar de baja asignación | ⚠️ Parcial (backend completo, falta frontend) |

## E09 — Responsable de tarea

| RF | Descripción | Estado |
|---|---|---|
| RF31 | Asignar responsable a tarea | ❌ Pendiente |
| RF32 | Quitar responsable de tarea | ❌ Pendiente |
| RF33 | Filtrar tareas por responsable | ❌ Pendiente |

---

## Resumen

| Área | Responsable | Estado |
|---|---|---|
| Auth + Usuarios (E01) | Integrante 1 | ✅ 100% completo |
| Clientes base (RF06-RF09) | Integrante 1 | ✅ 100% completo |
| Estadísticas dashboard (RF20) | Integrante 5 | ✅ 100% completo |
| Asignaciones backend (RF28-RF30) | Integrante 5 | ✅ Backend completo |
| Asignaciones frontend (RF28-RF30) | Integrante 5 | ❌ Pendiente |
| Proyectos + Tareas (RF02-RF12) | Integrantes 3 y 4 | ❌ 0% completo |
| Responsable de tarea (E09) | Integrante 4 | ❌ 0% completo |
| Búsqueda avanzada (E02) | Integrante 5 | ❌ Pendiente |
| Exportación CSV (E07) | Integrante 5 | ❌ Pendiente |
| Contactos de clientes (E06) | Integrante 2 | ❌ 0% completo |
| Pendiente total | — | ~55% restante |

---

## División de tareas

| Integrante | Módulo | RFs |
|---|---|---|
| Integrante 1 (Walter) | Auth + Usuarios + Clientes | RF01, RF06-RF09, RF13-RF16 |
| Integrante 2 | Contactos de clientes | RF23-RF25 |
| Integrante 3 | Proyectos | RF02-RF05, RF22 |
| Integrante 4 | Tareas + Kanban + Responsable | RF10-RF12, RF21, RF31-RF33 |
| Integrante 5 | Asignaciones + Búsqueda + Stats + CSV | RF28-RF30, RF17-RF20, RF26-RF27 |

> **Nota:** Integrante 5 tiene RF20 y el backend de RF28-RF30 completos.
> El frontend de RF28-RF30 depende de que Int. 3 tenga listo `detalle-proyecto.ts`.
> RF17-RF19 (filtros) depende de que los listados de proyectos y tareas existan.

---

## Instrucciones para el grupo

- Rama base: `develop`
- Obtener cambios: `git pull origin develop`
- Cada uno trabaja en su propia rama y mergea a `develop`
- Los commits deben referenciar los RFs: `feat: descripción (RF02, RF03)`
- Ver `ONBOARDING_GRUPO.md` para instrucciones detalladas de setup y tareas
