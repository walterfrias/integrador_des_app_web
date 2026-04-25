# Modelo Conceptual — Requerimientos
**Sistema:** Gestión de Proyectos  
**Materia:** Ingeniería de Software — UNER  
**Metodología:** OOWS (Object Oriented Approach for Web Solutions Modeling)

---

## 1. Requerimientos Funcionales

### Base

| ID    | Nombre                  | Descripción |
|-------|-------------------------|-------------|
| RF01  | Autenticar usuario      | El sistema permite el ingreso mediante nombre de usuario y clave. Solo usuarios en estado "Activo" pueden acceder. |
| RF02  | Listar proyectos        | El sistema muestra todos los proyectos registrados con su nombre, estado e indicador de retraso. |
| RF03  | Crear proyecto          | Permite crear un proyecto indicando nombre, estado, fecha límite opcional y opcionalmente un cliente en estado "Activo". |
| RF04  | Modificar proyecto      | Permite editar el nombre, estado, fecha límite y cliente de un proyecto existente. |
| RF05  | Ver detalle de proyecto | Muestra el detalle de un proyecto: cliente asociado, fecha límite y lista de tareas. |
| RF06  | Listar clientes         | El sistema muestra todos los clientes registrados con su nombre y estado. |
| RF07  | Crear cliente           | Permite registrar un cliente con nombre, estado y datos de contacto opcionales. |
| RF08  | Modificar cliente       | Permite editar el nombre, estado y datos de contacto de un cliente existente. |
| RF09  | Dar de baja cliente     | Permite dar de baja un cliente, siempre que no esté asociado a ningún proyecto. |
| RF10  | Agregar tarea           | Dado un proyecto existente, permite agregar una tarea con descripción y estado. |
| RF11  | Modificar tarea         | Permite editar la descripción y el estado de una tarea. |
| RF12  | Eliminar tarea          | Permite eliminar una tarea de un proyecto. |

### E01 — Gestión de usuarios y roles

| ID    | Nombre                  | Descripción |
|-------|-------------------------|-------------|
| RF13  | Listar usuarios         | El sistema muestra todos los usuarios registrados con su nombre, rol y estado. Solo accesible para usuarios con rol Admin. |
| RF14  | Crear usuario           | Permite registrar un nuevo usuario con nombre, clave, rol y estado. Solo accesible para usuarios con rol Admin. |
| RF15  | Modificar usuario       | Permite editar el nombre, clave, rol y estado de un usuario existente. Solo accesible para usuarios con rol Admin. |
| RF16  | Dar de baja usuario     | Permite dar de baja un usuario. Solo accesible para usuarios con rol Admin. Un usuario no puede darse de baja a sí mismo. |

### E02 — Búsqueda avanzada

| ID    | Nombre                       | Descripción |
|-------|------------------------------|-------------|
| RF17  | Filtrar y paginar proyectos  | Permite filtrar proyectos por nombre y/o estado, ordenar por columna y paginar resultados. |
| RF18  | Filtrar y paginar clientes   | Permite filtrar clientes por nombre y/o estado, ordenar por columna y paginar resultados. |
| RF19  | Filtrar y paginar tareas     | Permite filtrar tareas de un proyecto por estado, ordenar por columna y paginar resultados. |

### E03 — Estadísticas

| ID    | Nombre               | Descripción |
|-------|----------------------|-------------|
| RF20  | Ver estadísticas     | El dashboard muestra métricas del sistema: cantidad de proyectos activos, tareas pendientes, clientes activos y proyectos por cliente. |

### E04 — Panel visual de tareas (Kanban)

| ID    | Nombre            | Descripción |
|-------|-------------------|-------------|
| RF21  | Ver panel Kanban  | Dentro del detalle de un proyecto, permite visualizar las tareas como tarjetas agrupadas en columnas por estado (Pendiente / Finalizada / Baja). |

### E05 — Fecha de finalización de proyecto

| ID    | Nombre                        | Descripción |
|-------|-------------------------------|-------------|
| RF22  | Visualizar proyectos retrasados | En la lista de proyectos, se indica visualmente cuáles superaron su fecha límite sin estar finalizados. |

### E06 — Contacto de clientes

| ID    | Nombre                    | Descripción |
|-------|---------------------------|-------------|
| RF23  | Agregar contacto a cliente   | Permite registrar un dato de contacto (teléfono o email) asociado a un cliente. |
| RF24  | Modificar contacto de cliente | Permite editar un dato de contacto existente de un cliente. |
| RF25  | Eliminar contacto de cliente  | Permite eliminar un dato de contacto de un cliente. |

### E07 — Exportación CSV

| ID    | Nombre                  | Descripción |
|-------|-------------------------|-------------|
| RF26  | Exportar proyectos a CSV | Permite descargar el listado de proyectos (con estado y cliente) en formato CSV. |
| RF27  | Exportar tareas a CSV    | Permite descargar el listado de tareas de un proyecto en formato CSV. |

---

## 2. Restricciones

| ID   | Descripción |
|------|-------------|
| R01  | Solo se puede asignar a un proyecto un cliente que esté en estado "Activo". |
| R02  | Solo se puede dar de baja un cliente si no está registrado en ningún proyecto. |
| R03  | Todos los proyectos, clientes y tareas son visibles para todos los usuarios del sistema. |
| R04  | Los usuarios no son propietarios de los registros creados. |
| R05  | Solo usuarios con rol Admin pueden gestionar usuarios (crear, modificar, dar de baja). |
| R06  | Solo usuarios con rol Admin pueden dar de baja proyectos y tareas. |
| R07  | Un usuario no puede darse de baja a sí mismo. |
| R08  | La fecha límite de un proyecto, si se define, debe ser una fecha futura al momento de su creación. |

---

## 3. Requerimientos No Funcionales

| ID     | Categoría       | Nombre                  | Descripción |
|--------|-----------------|-------------------------|-------------|
| RNF01  | Seguridad       | Autenticación de acceso | El sistema debe requerir credenciales válidas para acceder a cualquier funcionalidad. |
| RNF02  | Usabilidad      | Interfaz amigable       | La interfaz debe ser simple e intuitiva. El tiempo de aprendizaje no debe superar los 5 minutos. |
| RNF03  | Performance     | Tiempo de respuesta     | Las operaciones deben responder en menos de 3 segundos bajo carga normal. |
| RNF04  | Portabilidad    | Compatibilidad web      | El sistema debe funcionar en cualquier navegador moderno (Chrome, Firefox, Edge). |
| RNF05  | Mantenibilidad  | Arquitectura modular    | El sistema debe estar estructurado en módulos independientes (backend y frontend separados). |
| RNF06  | Seguridad       | Control de acceso por rol | Las rutas y acciones restringidas a Admin deben estar protegidas tanto en frontend como en backend. |
