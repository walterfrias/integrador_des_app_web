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
| CN01  | Login                   | Punto de entrada al sistema. Solicita credenciales al usuario.              | —                                       | Ingresar credenciales, Enviar                  |
| CN02  | Dashboard               | Pantalla principal tras autenticarse. Muestra métricas del sistema y acceso a los módulos. | Nombre de usuario, rol activo, métricas (E03) | Ir a Proyectos, Ir a Clientes, Ir a Usuarios (solo Admin), Cerrar sesión |
| CN03  | Lista de Proyectos      | Muestra todos los proyectos con nombre, estado e indicador de retraso. Permite filtrar, ordenar y paginar. | Proyectos (nombre, estado, fechaLimite) | Ver detalle, Crear proyecto, Filtrar, Ordenar, Paginar, Exportar CSV |
| CN04  | Detalle de Proyecto     | Muestra la información completa de un proyecto, su cliente, fecha límite y sus tareas. Incluye vista Kanban. | Proyecto, Cliente asociado, Tareas      | Editar proyecto, Agregar tarea, Editar tarea, Eliminar tarea (Admin), Ver Kanban, Exportar tareas CSV |
| CN05  | Formulario de Proyecto  | Permite crear o modificar un proyecto.                                      | Proyecto, Lista de clientes activos     | Guardar, Cancelar                              |
| CN06  | Lista de Clientes       | Muestra todos los clientes con nombre y estado. Permite filtrar, ordenar y paginar. | Clientes (nombre, estado)              | Crear cliente, Editar cliente, Dar de baja, Filtrar, Ordenar, Paginar |
| CN07  | Formulario de Cliente   | Permite crear o modificar un cliente y gestionar sus contactos.             | Cliente, Contactos del cliente          | Guardar, Cancelar, Agregar contacto, Editar contacto, Eliminar contacto |
| CN08  | Formulario de Tarea     | Permite agregar o modificar una tarea dentro de un proyecto.                | Tarea, Proyecto al que pertenece        | Guardar, Cancelar                              |

### E01 — Gestión de usuarios y roles

| ID    | Nombre                  | Descripción                                                                 | Objetos visibles                        | Operaciones disponibles                        |
|-------|-------------------------|-----------------------------------------------------------------------------|-----------------------------------------|------------------------------------------------|
| CN09  | Lista de Usuarios       | Muestra todos los usuarios registrados con nombre, rol y estado. Solo accesible para Admin. | Usuarios (nombre, rol, estado)         | Crear usuario, Editar usuario, Dar de baja     |
| CN10  | Formulario de Usuario   | Permite crear o modificar un usuario. Solo accesible para Admin.            | Usuario                                 | Guardar, Cancelar                              |
