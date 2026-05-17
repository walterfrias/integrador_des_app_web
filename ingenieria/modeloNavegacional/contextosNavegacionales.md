# Modelo Navegacional — Contextos Navegacionales
**Sistema:** Gestión de Proyectos  
**Materia:** Ingeniería de Software — UNER  
**Metodología:** OOWS

---

## Contextos Navegacionales

Un contexto navegacional define el conjunto de objetos y operaciones visibles desde un punto específico del sistema.

### Base

| ID    | Nombre                  | Descripción                                                                 | Objetos visibles                        | Operaciones disponibles                        |
|-------|-------------------------|-----------------------------------------------------------------------------|-----------------------------------------|------------------------------------------------|
| CN01  | Login                   | Punto de entrada al sistema. Solicita email y clave al usuario.             | —                                       | Ingresar credenciales (email + clave), Enviar  |
| CN02  | Dashboard               | Pantalla principal tras autenticarse. Muestra métricas del sistema y acceso a los módulos. | Nombre de usuario, rol activo, métricas (E03) | Ir a Proyectos, Ir a Clientes, Ir a Usuarios (solo Admin), Cerrar sesión |
| CN03  | Lista de Proyectos      | Muestra todos los proyectos con nombre, estado e indicador de retraso. Permite filtrar, ordenar y paginar. | Proyectos (nombre, estado, fechaLimite) | Ver detalle, Crear proyecto, Filtrar, Ordenar, Paginar, Exportar CSV |
| CN04  | Detalle de Proyecto     | Muestra la información completa de un proyecto, su cliente, fecha límite, sus tareas y los usuarios asignados al proyecto. Incluye vista Kanban. | Proyecto, Cliente asociado, Tareas, Asignaciones (usuario + estado + fecha) | Editar proyecto, Agregar tarea, Editar tarea, Eliminar tarea (Admin), Ver Kanban, Exportar tareas CSV, Asignar usuario al proyecto, Dar de baja asignación |
| CN05  | Formulario de Proyecto  | Permite crear o modificar un proyecto.                                      | Proyecto, Lista de clientes activos     | Guardar, Cancelar                              |
| CN06  | Lista de Clientes       | Muestra todos los clientes con nombre, cuit y estado. Permite filtrar, ordenar y paginar. | Clientes (nombre, cuit, estado)   | Crear cliente, Editar cliente, Dar de baja, Filtrar, Ordenar, Paginar |
| CN07  | Formulario de Cliente   | Permite crear o modificar un cliente (nombre, cuit, dirección, estado) y gestionar sus contactos. | Cliente (nombre, cuit, direccion, estado), Contactos del cliente | Guardar, Cancelar, Agregar contacto, Editar contacto, Eliminar contacto |
| CN08  | Formulario de Tarea     | Permite agregar o modificar una tarea dentro de un proyecto. Incluye selección de responsable (E09). | Tarea, Proyecto al que pertenece, Lista de usuarios activos | Guardar, Cancelar, Asignar responsable, Quitar responsable |

### E01 — Gestión de usuarios y roles

| ID    | Nombre                  | Descripción                                                                 | Objetos visibles                        | Operaciones disponibles                        |
|-------|-------------------------|-----------------------------------------------------------------------------|-----------------------------------------|------------------------------------------------|
| CN09  | Lista de Usuarios       | Muestra todos los usuarios registrados con nombre, email, rol y estado. Solo accesible para Admin. | Usuarios (nombre, apellido, email, cuil, rol, estado) | Crear usuario, Editar usuario, Dar de baja |
| CN10  | Formulario de Usuario   | Permite crear o modificar un usuario (nombre, apellido, email, cuil, clave, rol, estado). Solo accesible para Admin. | Usuario                    | Guardar, Cancelar                              |

### E08 — Asignación de usuarios a proyectos

| ID    | Nombre                  | Descripción                                                                 | Objetos visibles                        | Operaciones disponibles                        |
|-------|-------------------------|-----------------------------------------------------------------------------|-----------------------------------------|------------------------------------------------|
| CN11  | Panel de asignaciones   | Sección dentro del detalle de proyecto que muestra los usuarios asignados con estado y fecha. Permite asignar nuevos usuarios y dar de baja asignaciones. | Asignaciones (usuario, estado, fechaAsignacion), Lista de usuarios activos | Asignar usuario (RF28), Dar de baja asignación (RF30), Filtrar por proyecto (RF29) |

### E09 — Responsable de tarea

El contexto CN08 (Formulario de Tarea) cubre esta expansión. El selector de responsable forma parte del formulario de tarea: permite asignar un usuario activo como responsable (RF31) o quitar el responsable existente (RF32). El filtro por responsable (RF33) es parte de CN04 (Detalle de Proyecto).
