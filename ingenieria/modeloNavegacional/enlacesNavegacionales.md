# Modelo Navegacional — Enlaces Navegacionales
**Sistema:** Gestión de Proyectos  
**Materia:** Ingeniería de Software — UNER  
**Metodología:** OOWS

---

## Enlaces Navegacionales

Un enlace navegacional define la transición entre dos contextos. Puede ser activado por una acción del usuario o por una condición del sistema.

### Base

| ID    | Origen                  | Destino                 | Activador                              | Condición                                      |
|-------|-------------------------|-------------------------|----------------------------------------|------------------------------------------------|
| EN01  | CN01 - Login            | CN02 - Dashboard        | Envío de credenciales                  | Usuario existe y está en estado "Activo"        |
| EN02  | CN02 - Dashboard        | CN03 - Lista Proyectos  | Clic en "Proyectos"                    | Usuario autenticado                            |
| EN03  | CN02 - Dashboard        | CN06 - Lista Clientes   | Clic en "Clientes"                     | Usuario autenticado                            |
| EN04  | CN03 - Lista Proyectos  | CN04 - Detalle Proyecto | Clic en un proyecto                    | Proyecto seleccionado existe                   |
| EN05  | CN03 - Lista Proyectos  | CN05 - Form. Proyecto   | Clic en "Crear proyecto"               | Usuario autenticado                            |
| EN06  | CN04 - Detalle Proyecto | CN05 - Form. Proyecto   | Clic en "Editar proyecto"              | Proyecto en estado "Activo"                    |
| EN07  | CN04 - Detalle Proyecto | CN08 - Form. Tarea      | Clic en "Agregar tarea"                | Proyecto existe                                |
| EN08  | CN04 - Detalle Proyecto | CN08 - Form. Tarea      | Clic en "Editar tarea"                 | Tarea seleccionada existe                      |
| EN09  | CN05 - Form. Proyecto   | CN03 - Lista Proyectos  | Guardar exitoso / Cancelar             | —                                              |
| EN10  | CN06 - Lista Clientes   | CN07 - Form. Cliente    | Clic en "Crear cliente"                | Usuario autenticado                            |
| EN11  | CN06 - Lista Clientes   | CN07 - Form. Cliente    | Clic en "Editar cliente"               | Cliente seleccionado existe                    |
| EN12  | CN07 - Form. Cliente    | CN06 - Lista Clientes   | Guardar exitoso / Cancelar             | —                                              |
| EN13  | CN08 - Form. Tarea      | CN04 - Detalle Proyecto | Guardar exitoso / Cancelar             | —                                              |
| EN14  | Cualquier contexto      | CN01 - Login            | Clic en "Cerrar sesión"                | Usuario autenticado                            |

### E01 — Gestión de usuarios y roles

| ID    | Origen                  | Destino                 | Activador                              | Condición                                      |
|-------|-------------------------|-------------------------|----------------------------------------|------------------------------------------------|
| EN15  | CN02 - Dashboard        | CN09 - Lista Usuarios   | Clic en "Usuarios"                     | Usuario autenticado con rol Admin              |
| EN16  | CN09 - Lista Usuarios   | CN10 - Form. Usuario    | Clic en "Crear usuario"                | Usuario autenticado con rol Admin              |
| EN17  | CN09 - Lista Usuarios   | CN10 - Form. Usuario    | Clic en "Editar usuario"               | Usuario seleccionado existe                    |
| EN18  | CN10 - Form. Usuario    | CN09 - Lista Usuarios   | Guardar exitoso / Cancelar             | —                                              |

---

## Diagrama de Flujo Navegacional

```mermaid
flowchart TD
    CN01([CN01\nLogin])
    CN02([CN02\nDashboard])
    CN03([CN03\nLista Proyectos])
    CN04([CN04\nDetalle Proyecto])
    CN05([CN05\nForm. Proyecto])
    CN06([CN06\nLista Clientes])
    CN07([CN07\nForm. Cliente])
    CN08([CN08\nForm. Tarea])
    CN09([CN09\nLista Usuarios\nsolo Admin])
    CN10([CN10\nForm. Usuario\nsolo Admin])

    CN01 -->|"EN01: credenciales válidas"| CN02
    CN02 -->|"EN02: ir a Proyectos"| CN03
    CN02 -->|"EN03: ir a Clientes"| CN06
    CN02 -->|"EN15: ir a Usuarios (Admin)"| CN09
    CN03 -->|"EN04: ver detalle"| CN04
    CN03 -->|"EN05: crear proyecto"| CN05
    CN04 -->|"EN06: editar proyecto"| CN05
    CN04 -->|"EN07: agregar tarea"| CN08
    CN04 -->|"EN08: editar tarea"| CN08
    CN05 -->|"EN09: guardar / cancelar"| CN03
    CN06 -->|"EN10: crear cliente"| CN07
    CN06 -->|"EN11: editar cliente"| CN07
    CN07 -->|"EN12: guardar / cancelar"| CN06
    CN08 -->|"EN13: guardar / cancelar"| CN04
    CN09 -->|"EN16: crear usuario"| CN10
    CN09 -->|"EN17: editar usuario"| CN10
    CN10 -->|"EN18: guardar / cancelar"| CN09
    CN02 -->|"EN14: cerrar sesión"| CN01
    CN03 -->|"EN14: cerrar sesión"| CN01
    CN06 -->|"EN14: cerrar sesión"| CN01
    CN09 -->|"EN14: cerrar sesión"| CN01
```
