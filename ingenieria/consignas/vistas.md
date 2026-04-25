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
│  Usuario │                       │       │
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
- Campo texto: nombre de usuario
- Campo password: clave
- Botón: Ingresar
- Área de mensaje: error de autenticación

---

## V02 — Dashboard
**Contexto:** CN02  
**Descripción:** Pantalla principal post-login. Acceso a los módulos del sistema.

```
┌─────────────────────────────────────────────────────┐
│  GESTIÓN DE PROYECTOS          👤 usuario | [Salir] │
├─────────────────────────────────────────────────────┤
│                                                     │
│   ┌─────────────────┐   ┌─────────────────┐        │
│   │                 │   │                 │        │
│   │   📁 PROYECTOS  │   │   👥 CLIENTES   │        │
│   │                 │   │                 │        │
│   └─────────────────┘   └─────────────────┘        │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**Componentes:**
- Header: nombre del sistema + usuario activo + botón Cerrar sesión
- Tarjeta de acceso: Proyectos (enlace EN02)
- Tarjeta de acceso: Clientes (enlace EN03)

---

## V03 — Lista de Proyectos
**Contexto:** CN03  
**Descripción:** Listado de todos los proyectos registrados.

```
┌─────────────────────────────────────────────────────┐
│  GESTIÓN DE PROYECTOS          👤 usuario | [Salir] │
├─────────────────────────────────────────────────────┤
│  Proyectos                        [+ Nuevo Proyecto]│
├──────────────────────┬──────────────┬───────────────┤
│  Nombre              │  Estado      │  Acciones     │
├──────────────────────┼──────────────┼───────────────┤
│  Proyecto Alpha      │  Activo      │  [Ver]        │
│  Proyecto Beta       │  Finalizado  │  [Ver]        │
│  Proyecto Gamma      │  Baja        │  [Ver]        │
└──────────────────────┴──────────────┴───────────────┘
```

**Componentes:**
- Header con navegación
- Botón: Nuevo Proyecto (enlace EN05)
- Tabla: nombre, estado, acción Ver (enlace EN04)

---

## V04 — Detalle de Proyecto
**Contexto:** CN04  
**Descripción:** Información completa de un proyecto, cliente asociado y sus tareas.

```
┌─────────────────────────────────────────────────────┐
│  GESTIÓN DE PROYECTOS          👤 usuario | [Salir] │
├─────────────────────────────────────────────────────┤
│  ← Volver a Proyectos                               │
│                                                     │
│  Proyecto: Proyecto Alpha          [Editar Proyecto]│
│  Estado:   Activo                                   │
│  Cliente:  Empresa XYZ                              │
│                                                     │
├─────────────────────────────────────────────────────┤
│  Tareas                               [+ Agregar]   │
├──────────────────────────┬────────────┬─────────────┤
│  Descripción             │  Estado    │  Acciones   │
├──────────────────────────┼────────────┼─────────────┤
│  Diseñar base de datos   │  Finalizado│  [Editar]   │
│  Desarrollar API REST    │  Pendiente │  [Editar]   │
│  Crear interfaz Angular  │  Pendiente │  [Editar]   │
└──────────────────────────┴────────────┴─────────────┘
```

**Componentes:**
- Enlace: Volver a lista (enlace EN04 inverso)
- Datos del proyecto: nombre, estado, cliente
- Botón: Editar Proyecto (enlace EN06)
- Tabla de tareas: descripción, estado, botón Editar (enlace EN08)
- Botón: Agregar tarea (enlace EN07)

---

## V05 — Formulario de Proyecto
**Contexto:** CN05  
**Descripción:** Formulario para crear o modificar un proyecto.

```
┌─────────────────────────────────────────────────────┐
│  GESTIÓN DE PROYECTOS          👤 usuario | [Salir] │
├─────────────────────────────────────────────────────┤
│  Nuevo Proyecto / Editar Proyecto                   │
│                                                     │
│  Nombre     ┌───────────────────────────────┐       │
│             └───────────────────────────────┘       │
│                                                     │
│  Estado     ┌───────────────────────────────┐       │
│             │ Activo ▾                       │       │
│             └───────────────────────────────┘       │
│                                                     │
│  Cliente    ┌───────────────────────────────┐       │
│             │ (Ninguno - proyecto interno) ▾ │       │
│             └───────────────────────────────┘       │
│             ℹ Solo clientes en estado Activo        │
│                                                     │
│                  [Guardar]   [Cancelar]             │
└─────────────────────────────────────────────────────┘
```

**Componentes:**
- Campo texto: nombre del proyecto
- Select: estado (Activo / Finalizado / Baja)
- Select: cliente (solo clientes Activos + opción "Ninguno") — restricción R01
- Botón: Guardar (enlace EN09)
- Botón: Cancelar (enlace EN09)

---

## V06 — Lista de Clientes
**Contexto:** CN06  
**Descripción:** Listado de todos los clientes registrados.

```
┌─────────────────────────────────────────────────────┐
│  GESTIÓN DE PROYECTOS          👤 usuario | [Salir] │
├─────────────────────────────────────────────────────┤
│  Clientes                          [+ Nuevo Cliente]│
├──────────────────────┬──────────────┬───────────────┤
│  Nombre              │  Estado      │  Acciones     │
├──────────────────────┼──────────────┼───────────────┤
│  Empresa XYZ         │  Activo      │  [Editar]     │
│  Empresa ABC         │  Activo      │  [Editar]     │
│  Empresa DEF         │  Baja        │  [Editar]     │
└──────────────────────┴──────────────┴───────────────┘
```

**Componentes:**
- Botón: Nuevo Cliente (enlace EN10)
- Tabla: nombre, estado, botón Editar (enlace EN11)
- Nota: botón Dar de baja deshabilitado si cliente tiene proyectos (restricción R02)

---

## V07 — Formulario de Cliente
**Contexto:** CN07  
**Descripción:** Formulario para crear o modificar un cliente.

```
┌─────────────────────────────────────────────────────┐
│  GESTIÓN DE PROYECTOS          👤 usuario | [Salir] │
├─────────────────────────────────────────────────────┤
│  Nuevo Cliente / Editar Cliente                     │
│                                                     │
│  Nombre     ┌───────────────────────────────┐       │
│             └───────────────────────────────┘       │
│                                                     │
│  Estado     ┌───────────────────────────────┐       │
│             │ Activo ▾                       │       │
│             └───────────────────────────────┘       │
│             ⚠ No se puede dar de baja si tiene     │
│               proyectos asociados                   │
│                                                     │
│                  [Guardar]   [Cancelar]             │
└─────────────────────────────────────────────────────┘
```

**Componentes:**
- Campo texto: nombre del cliente
- Select: estado (Activo / Baja) — con validación de restricción R02
- Mensaje de advertencia: si el cliente tiene proyectos, Baja está deshabilitado
- Botón: Guardar (enlace EN12)
- Botón: Cancelar (enlace EN12)

---

## V08 — Formulario de Tarea
**Contexto:** CN08  
**Descripción:** Formulario para agregar o modificar una tarea dentro de un proyecto.

```
┌─────────────────────────────────────────────────────┐
│  GESTIÓN DE PROYECTOS          👤 usuario | [Salir] │
├─────────────────────────────────────────────────────┤
│  Nueva Tarea / Editar Tarea                         │
│  Proyecto: Proyecto Alpha                           │
│                                                     │
│  Descripción                                        │
│  ┌───────────────────────────────────────────────┐  │
│  │                                               │  │
│  └───────────────────────────────────────────────┘  │
│                                                     │
│  Estado     ┌───────────────────────────────┐       │
│             │ Pendiente ▾                    │       │
│             └───────────────────────────────┘       │
│                                                     │
│                  [Guardar]   [Cancelar]             │
└─────────────────────────────────────────────────────┘
```

**Componentes:**
- Referencia (solo lectura): nombre del proyecto al que pertenece
- Campo texto (área): descripción de la tarea
- Select: estado (Pendiente / Finalizado / Baja)
- Botón: Guardar (enlace EN13)
- Botón: Cancelar (enlace EN13)

---

## Resumen de correspondencia

| Vista | Contexto | RF cubiertos         |
|-------|----------|----------------------|
| V01   | CN01     | RF01                 |
| V02   | CN02     | —                    |
| V03   | CN03     | RF02                 |
| V04   | CN04     | RF05, RF12           |
| V05   | CN05     | RF03, RF04           |
| V06   | CN06     | RF06, RF09           |
| V07   | CN07     | RF07, RF08           |
| V08   | CN08     | RF10, RF11           |
