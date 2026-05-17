# Modelo de Presentación — Vistas
**Sistema:** Gestión de Proyectos  
**Materia:** Ingeniería de Software — UNER  
**Metodología:** OOWS

Cada vista corresponde a un contexto navegacional definido en el Paso 2.  
Las representaciones son wireframes textuales (bocetos de estructura).

---

## V01 — Login
**Contexto:** CN01  
**Descripción:** Pantalla de entrada al sistema. Solicita credenciales al usuario.

```
┌─────────────────────────────────────────┐
│                                         │
│         GESTIÓN DE PROYECTOS            │
│                                         │
│         ┌───────────────────────┐       │
│  Email  │                       │       │
│         └───────────────────────┘       │
│                                         │
│         ┌───────────────────────┐       │
│  Clave  │                       │       │
│         └───────────────────────┘       │
│                                         │
│              [ Ingresar ]               │
│                                         │
│    ⚠ Mensaje de error (si aplica)       │
│                                         │
└─────────────────────────────────────────┘
```

**Componentes:**
- Campo email: dirección de correo electrónico del usuario
- Campo password: clave (con toggle mostrar/ocultar)
- Botón: Ingresar
- Área de mensaje: error de autenticación

---

## V02 — Dashboard
**Contexto:** CN02  
**Descripción:** Pantalla principal post-login. Muestra métricas del sistema (E03) y acceso a los módulos. El acceso a Usuarios solo es visible para Admin (E01).

```
┌─────────────────────────────────────────────────────────────┐
│  GESTIÓN DE PROYECTOS              👤 usuario (Admin)|[Salir]│
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   Proyectos activos: 5   Tareas pendientes: 12             │
│   Clientes activos: 3    Proyectos retrasados: 2           │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  PROYECTOS   │  │  CLIENTES    │  │  USUARIOS    │      │
│  │              │  │              │  │  (solo Admin)│      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Componentes:**
- Header: nombre del sistema + usuario activo + rol + botón Cerrar sesión
- Panel de métricas: proyectos activos, tareas pendientes, clientes activos, proyectos retrasados
- Tarjeta: Proyectos (enlace EN02)
- Tarjeta: Clientes (enlace EN03)
- Tarjeta: Usuarios — visible solo si rol Admin (enlace EN15)

---

## V03 — Lista de Proyectos
**Contexto:** CN03  
**Descripción:** Listado de proyectos con filtros, paginación, indicador de retraso (E02, E05) y exportación CSV (E07).

```
┌─────────────────────────────────────────────────────────────┐
│  GESTIÓN DE PROYECTOS              👤 usuario (Admin)|[Salir]│
├─────────────────────────────────────────────────────────────┤
│  Proyectos                [+ Nuevo Proyecto] [Exportar CSV] │
├─────────────────────────────────────────────────────────────┤
│  Buscar: [____________]  Estado: [Todos ▾]  [Filtrar]       │
├──────────────────────┬──────────────┬──────────┬───────────┤
│  Nombre ↑↓           │  Estado ↑↓   │  Límite  │  Acciones │
├──────────────────────┼──────────────┼──────────┼───────────┤
│  Proyecto Alpha       │  Activo      │ 2026-06  │  [Ver]    │
│  Proyecto Beta       │  Finalizado  │ 2026-03  │  [Ver]    │
│ ⚠ Proyecto Gamma    │  Activo      │ 2026-01  │  [Ver]    │
├──────────────────────┴──────────────┴──────────┴───────────┤
│  Página 1 de 3  [← Anterior]  [Siguiente →]                │
└─────────────────────────────────────────────────────────────┘
```

**Componentes:**
- Botón: Nuevo Proyecto (enlace EN05)
- Botón: Exportar CSV (RF26)
- Filtro por nombre (texto libre) y estado (select)
- Tabla: nombre, estado, fecha límite, acción Ver (enlace EN04). Columnas ordenables.
- Indicador ⚠ en proyectos retrasados (fecha límite vencida y estado != Finalizado)
- Paginación

---

## V04 — Detalle de Proyecto
**Contexto:** CN04  
**Descripción:** Información completa de un proyecto. Incluye vista Kanban (E04) y exportación de tareas CSV (E07). Eliminar tarea solo disponible para Admin (E01).

```
┌─────────────────────────────────────────────────────────────┐
│  GESTIÓN DE PROYECTOS              👤 usuario (Admin)|[Salir]│
├─────────────────────────────────────────────────────────────┤
│  ← Volver a Proyectos                                       │
│                                                             │
│  Proyecto: Proyecto Alpha              [Editar Proyecto]    │
│  Estado:   Activo                                           │
│  Cliente:  Empresa XYZ                                      │
│  Fecha límite: 2026-06-30  (quedan 65 días)                │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  Tareas   [Vista: Tabla | Kanban]  [+ Agregar] [Export CSV] │
├─────────────────────────────────────────────────────────────┤
│  Vista Tabla:                                               │
├──────────────────────────┬────────────┬─────────────────────┤
│  Descripción             │  Estado    │  Acciones           │
├──────────────────────────┼────────────┼─────────────────────┤
│  Diseñar base de datos   │  Finalizada│  [Editar]           │
│  Desarrollar API REST    │  Pendiente │  [Editar] [Eliminar]│
│  Crear interfaz Angular  │  Pendiente │  [Editar] [Eliminar]│
└──────────────────────────┴────────────┴─────────────────────┘
```

**Componentes:**
- Enlace: Volver a lista (enlace EN04 inverso)
- Datos del proyecto: nombre, estado, cliente, fecha límite con días restantes
- Botón: Editar Proyecto (enlace EN06)
- Toggle de vista: Tabla / Kanban (RF21)
- Botón: Exportar tareas CSV (RF27)
- Tabla de tareas: descripción, estado, responsable, botón Editar (enlace EN08), botón Eliminar (solo Admin, RF12 — R06)
- Botón: Agregar tarea (enlace EN07)
- Sección Asignaciones (E08): tabla con usuario, estado, fecha de asignación + botón Asignar usuario + botón Dar de baja asignación

---

## V04b — Panel Kanban de Tareas
**Contexto:** CN04 (vista alternativa)  
**Descripción:** Vista Kanban activada desde el toggle en V04 (E04).

```
┌─────────────────────────────────────────────────────────────┐
│  Tareas   [Vista: Tabla | Kanban]  [+ Agregar] [Export CSV] │
├───────────────────┬──────────────────┬───────────────────── ┤
│   PENDIENTE       │   FINALIZADA     │   BAJA               │
├───────────────────┼──────────────────┼──────────────────────┤
│ ┌───────────────┐ │ ┌──────────────┐ │                      │
│ │Desarrollar API│ │ │Diseñar BD    │ │                      │
│ │[Editar]       │ │ │[Editar]      │ │                      │
│ └───────────────┘ │ └──────────────┘ │                      │
│ ┌───────────────┐ │                  │                      │
│ │Crear interfaz │ │                  │                      │
│ │[Editar]       │ │                  │                      │
│ └───────────────┘ │                  │                      │
└───────────────────┴──────────────────┴──────────────────────┘
```

**Componentes:**
- Tres columnas: Pendiente / Finalizada / Baja
- Tarjetas de tarea con descripción y botón Editar (enlace EN08)

---

## V05 — Formulario de Proyecto
**Contexto:** CN05  
**Descripción:** Formulario para crear o modificar un proyecto. Incluye campo fecha límite (E05).

```
┌─────────────────────────────────────────────────────────────┐
│  GESTIÓN DE PROYECTOS              👤 usuario (Admin)|[Salir]│
├─────────────────────────────────────────────────────────────┤
│  Nuevo Proyecto / Editar Proyecto                           │
│                                                             │
│  Nombre     ┌───────────────────────────────┐               │
│             └───────────────────────────────┘               │
│                                                             │
│  Estado     ┌───────────────────────────────┐               │
│             │ Activo ▾                       │               │
│             └───────────────────────────────┘               │
│                                                             │
│  Cliente    ┌───────────────────────────────┐               │
│             │ (Ninguno - proyecto interno) ▾ │               │
│             └───────────────────────────────┘               │
│             ℹ Solo clientes en estado Activo                │
│                                                             │
│  Fecha límite ┌─────────────────────────────┐               │
│               │ dd/mm/aaaa         (opcional)│               │
│               └─────────────────────────────┘               │
│                                                             │
│                  [Guardar]   [Cancelar]                     │
└─────────────────────────────────────────────────────────────┘
```

**Componentes:**
- Campo texto: nombre del proyecto
- Select: estado (Activo / Finalizado / Baja)
- Select: cliente (solo clientes Activos + opción "Ninguno") — restricción R01
- Date picker: fecha límite (opcional) — restricción R08
- Botón: Guardar (enlace EN09)
- Botón: Cancelar (enlace EN09)

---

## V06 — Lista de Clientes
**Contexto:** CN06  
**Descripción:** Listado de clientes con filtros y paginación (E02).

```
┌─────────────────────────────────────────────────────────────┐
│  GESTIÓN DE PROYECTOS              👤 usuario (Admin)|[Salir]│
├─────────────────────────────────────────────────────────────┤
│  Clientes                              [+ Nuevo Cliente]    │
├─────────────────────────────────────────────────────────────┤
│  Buscar: [____________]  Estado: [Todos ▾]  [Filtrar]       │
├──────────────────────┬──────────────┬───────────────────────┤
│  Nombre ↑↓           │  Estado ↑↓   │  Acciones             │
├──────────────────────┼──────────────┼───────────────────────┤
│  Empresa XYZ         │  Activo      │  [Editar]             │
│  Empresa ABC         │  Activo      │  [Editar]             │
│  Empresa DEF         │  Baja        │  [Editar]             │
├──────────────────────┴──────────────┴───────────────────────┤
│  Página 1 de 2  [← Anterior]  [Siguiente →]                │
└─────────────────────────────────────────────────────────────┘
```

**Componentes:**
- Botón: Nuevo Cliente (enlace EN10)
- Filtro por nombre y estado
- Tabla: nombre, estado, botón Editar (enlace EN11). Columnas ordenables.
- Nota: opción de dar de baja deshabilitada si cliente tiene proyectos (restricción R02)
- Paginación

---

## V07 — Formulario de Cliente
**Contexto:** CN07  
**Descripción:** Formulario para crear o modificar un cliente. Incluye gestión de contactos (E06).

```
┌─────────────────────────────────────────────────────────────┐
│  GESTIÓN DE PROYECTOS              👤 usuario (Admin)|[Salir]│
├─────────────────────────────────────────────────────────────┤
│  Nuevo Cliente / Editar Cliente                             │
│                                                             │
│  Nombre     ┌───────────────────────────────┐               │
│             └───────────────────────────────┘               │
│                                                             │
│  CUIT       ┌───────────────────────────────┐  (opcional)   │
│             └───────────────────────────────┘               │
│                                                             │
│  Dirección  ┌───────────────────────────────┐  (opcional)   │
│             └───────────────────────────────┘               │
│                                                             │
│  Estado     ┌───────────────────────────────┐               │
│             │ Activo ▾                       │               │
│             └───────────────────────────────┘               │
│             ⚠ No se puede dar de baja si tiene             │
│               proyectos asociados                           │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  Contactos                              [+ Agregar contacto]│
├──────────────────────┬──────────────────┬───────────────────┤
│  Tipo                │  Valor           │  Acciones         │
├──────────────────────┼──────────────────┼───────────────────┤
│  Email               │  xyz@empresa.com │  [Editar][Eliminar]│
│  Telefono            │  +54 9 11 1234   │  [Editar][Eliminar]│
└──────────────────────┴──────────────────┴───────────────────┘
│                                                             │
│                  [Guardar]   [Cancelar]                     │
└─────────────────────────────────────────────────────────────┘
```

**Componentes:**
- Campo texto: nombre del cliente
- Campo texto: CUIT (único, opcional)
- Campo texto: dirección (opcional)
- Select: estado (Activo / Baja) — con validación de restricción R02
- Mensaje de advertencia: si el cliente tiene proyectos, Baja está deshabilitado
- Tabla de contactos: tipo, valor, botones Editar y Eliminar (RF23, RF24, RF25)
- Botón: Agregar contacto (abre inline o modal)
- Botón: Guardar (enlace EN12)
- Botón: Cancelar (enlace EN12)

---

## V08 — Formulario de Tarea
**Contexto:** CN08  
**Descripción:** Formulario para agregar o modificar una tarea dentro de un proyecto.

```
┌─────────────────────────────────────────────────────────────┐
│  GESTIÓN DE PROYECTOS              👤 usuario (Admin)|[Salir]│
├─────────────────────────────────────────────────────────────┤
│  Nueva Tarea / Editar Tarea                                 │
│  Proyecto: Proyecto Alpha                                   │
│                                                             │
│  Descripción                                                │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                                                       │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  Estado     ┌───────────────────────────────┐               │
│             │ Pendiente ▾                    │               │
│             └───────────────────────────────┘               │
│                                                             │
│  Responsable ┌──────────────────────────────┐  [X Quitar]   │
│              │ (Sin asignar) ▾               │               │
│              └──────────────────────────────┘               │
│              ℹ Solo usuarios en estado Activo (R10)         │
│                                                             │
│                  [Guardar]   [Cancelar]                     │
└─────────────────────────────────────────────────────────────┘
```

**Componentes:**
- Referencia (solo lectura): nombre del proyecto al que pertenece
- Campo texto (área): descripción de la tarea
- Select: estado (Pendiente / Finalizada / Baja)
- Select: responsable — lista de usuarios activos + opción "Sin asignar" (RF31, RF32 — R10)
- Botón X: quitar responsable (visible solo si hay uno asignado)
- Botón: Guardar (enlace EN13)
- Botón: Cancelar (enlace EN13)

---

## V09 — Lista de Usuarios
**Contexto:** CN09 — Solo Admin  
**Descripción:** Listado de usuarios del sistema. Accesible únicamente para usuarios con rol Admin (E01).

```
┌─────────────────────────────────────────────────────────────┐
│  GESTIÓN DE PROYECTOS              👤 admin (Admin) | [Salir]│
├─────────────────────────────────────────────────────────────┤
│  Usuarios                              [+ Nuevo Usuario]    │
├──────────────┬───────────────────┬────────────┬──────────┬──────────┤
│  Nombre ↑↓  │  Email ↑↓         │  Rol ↑↓    │  Estado  │  Acciones│
├──────────────┼───────────────────┼────────────┼──────────┼──────────┤
│  Juan Pérez  │  j@empresa.com    │  Admin     │  Activo  │  [Editar]│
│  Ana García  │  a@empresa.com    │  Operador  │  Activo  │  [Editar]│
│  Carlos Ruiz │  c@empresa.com    │  Operador  │  Baja    │  [Editar]│
└──────────────┴───────────────────┴────────────┴──────────┴──────────┘
```

**Componentes:**
- Botón: Nuevo Usuario (enlace EN16)
- Tabla: nombre, email, rol, estado, botón Editar (enlace EN17). Columnas ordenables.
- Nota: un usuario no puede darse de baja a sí mismo (restricción R07)

---

## V10 — Formulario de Usuario
**Contexto:** CN10 — Solo Admin  
**Descripción:** Formulario para crear o modificar un usuario (E01).

```
┌─────────────────────────────────────────────────────────────┐
│  GESTIÓN DE PROYECTOS              👤 admin (Admin) | [Salir]│
├─────────────────────────────────────────────────────────────┤
│  Nuevo Usuario / Editar Usuario                             │
│                                                             │
│  ┌─────────────────────────┐ ┌─────────────────────────┐    │
│  │ Nombre  [____________]  │ │ Apellido [____________]  │    │
│  └─────────────────────────┘ └─────────────────────────┘    │
│                                                             │
│  ┌─────────────────────────┐ ┌─────────────────────────┐    │
│  │ Email   [____________]  │ │ CUIL    [____________]   │    │
│  └─────────────────────────┘ └─────────────────────────┘    │
│                                                             │
│  Clave      ┌───────────────────────────────┐               │
│             └───────────────────────────────┘               │
│             ℹ Dejar vacío para no modificar (en edición)   │
│                                                             │
│  Rol        ┌───────────────────────────────┐               │
│             │ Operador ▾                     │               │
│             └───────────────────────────────┘               │
│                                                             │
│  Estado     ┌───────────────────────────────┐               │
│             │ Activo ▾                       │               │
│             └───────────────────────────────┘               │
│             ⚠ No puede dar de baja a su propio usuario     │
│                                                             │
│                  [Guardar]   [Cancelar]                     │
└─────────────────────────────────────────────────────────────┘
```

**Componentes:**
- Campo texto: nombre de usuario
- Campo texto: apellido
- Campo email: dirección de email (único por usuario)
- Campo texto: CUIL (único, opcional)
- Campo password: clave (opcional en edición)
- Select: rol (Admin / Operador)
- Select: estado (Activo / Baja) — con validación de restricción R07
- Mensaje de advertencia: si el usuario está editando su propia cuenta, Baja está deshabilitado
- Botón: Guardar (enlace EN18)
- Botón: Cancelar (enlace EN18)

---

## Resumen de correspondencia

| Vista  | Contexto | RF cubiertos                        | Expansión          |
|--------|----------|-------------------------------------|--------------------|
| V01    | CN01     | RF01                                | —                  |
| V02    | CN02     | RF20                                | E01, E03           |
| V03    | CN03     | RF02, RF17, RF22, RF26              | E02, E05, E07      |
| V04    | CN04     | RF05, RF12, RF21, RF27, RF28, RF29, RF30 | E01, E04, E07, E08 |
| V04b   | CN04     | RF21                                | E04                |
| V05    | CN05     | RF03, RF04                          | E05                |
| V06    | CN06     | RF06, RF09, RF18                    | E02                |
| V07    | CN07     | RF07, RF08, RF23, RF24, RF25        | E06                |
| V08    | CN08     | RF10, RF11, RF31, RF32              | E09                |
| V09    | CN09     | RF13, RF16                          | E01                |
| V10    | CN10     | RF14, RF15                          | E01                |
