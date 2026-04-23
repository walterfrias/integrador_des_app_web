# Modelo Navegacional — Contextos Navegacionales
**Sistema:** Gestión de Proyectos  
**Materia:** Ingeniería de Software — UNER  
**Metodología:** OOWS

---

## Contextos Navegacionales

Un contexto navegacional define el conjunto de objetos y operaciones visibles desde un punto específico del sistema.

| ID    | Nombre                  | Descripción                                                                 | Objetos visibles                        | Operaciones disponibles                        |
|-------|-------------------------|-----------------------------------------------------------------------------|-----------------------------------------|------------------------------------------------|
| CN01  | Login                   | Punto de entrada al sistema. Solicita credenciales al usuario.              | —                                       | Ingresar credenciales, Enviar                  |
| CN02  | Dashboard               | Pantalla principal tras autenticarse. Punto de acceso a los módulos.        | Nombre de usuario activo                | Ir a Proyectos, Ir a Clientes, Cerrar sesión   |
| CN03  | Lista de Proyectos      | Muestra todos los proyectos con nombre y estado.                            | Proyectos (nombre, estado)              | Ver detalle, Crear proyecto                    |
| CN04  | Detalle de Proyecto     | Muestra la información completa de un proyecto, su cliente y sus tareas.   | Proyecto, Cliente asociado, Tareas      | Editar proyecto, Agregar tarea, Editar tarea, Eliminar tarea |
| CN05  | Formulario de Proyecto  | Permite crear o modificar un proyecto.                                      | Proyecto, Lista de clientes activos     | Guardar, Cancelar                              |
| CN06  | Lista de Clientes       | Muestra todos los clientes con nombre y estado.                             | Clientes (nombre, estado)              | Crear cliente, Editar cliente, Dar de baja     |
| CN07  | Formulario de Cliente   | Permite crear o modificar un cliente.                                       | Cliente                                 | Guardar, Cancelar                              |
| CN08  | Formulario de Tarea     | Permite agregar o modificar una tarea dentro de un proyecto.                | Tarea, Proyecto al que pertenece        | Guardar, Cancelar                              |
