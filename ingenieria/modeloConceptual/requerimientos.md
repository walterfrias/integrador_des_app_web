# Modelo Conceptual — Requerimientos
**Sistema:** Gestión de Proyectos  
**Materia:** Ingeniería de Software — UNER  
**Metodología:** OOWS (Object Oriented Approach for Web Solutions Modeling)

---

## 1. Requerimientos Funcionales

| ID    | Nombre                  | Descripción |
|-------|-------------------------|-------------|
| RF01  | Autenticar usuario      | El sistema permite el ingreso mediante nombre de usuario y clave. Solo usuarios en estado "Activo" pueden acceder. |
| RF02  | Listar proyectos        | El sistema muestra todos los proyectos registrados con su nombre y estado. |
| RF03  | Crear proyecto          | Permite crear un proyecto indicando nombre, estado y opcionalmente un cliente en estado "Activo". |
| RF04  | Modificar proyecto      | Permite editar el nombre, estado y cliente de un proyecto existente. |
| RF05  | Ver detalle de proyecto | Muestra el detalle de un proyecto: cliente asociado y lista de tareas. |
| RF06  | Listar clientes         | El sistema muestra todos los clientes registrados con su nombre y estado. |
| RF07  | Crear cliente           | Permite registrar un cliente con nombre y estado. |
| RF08  | Modificar cliente       | Permite editar el nombre y estado de un cliente existente. |
| RF09  | Dar de baja cliente     | Permite dar de baja un cliente, siempre que no esté asociado a ningún proyecto. |
| RF10  | Agregar tarea           | Dado un proyecto existente, permite agregar una tarea con descripción y estado. |
| RF11  | Modificar tarea         | Permite editar la descripción y el estado de una tarea. |
| RF12  | Eliminar tarea          | Permite eliminar una tarea de un proyecto. |

---

## 2. Restricciones

| ID   | Descripción |
|------|-------------|
| R01  | Solo se puede asignar a un proyecto un cliente que esté en estado "Activo". |
| R02  | Solo se puede dar de baja un cliente si no está registrado en ningún proyecto. |
| R03  | Todos los proyectos, clientes y tareas son visibles para todos los usuarios del sistema. |
| R04  | Los usuarios no son propietarios de los registros creados. |

---

## 3. Requerimientos No Funcionales

| ID     | Categoría       | Nombre                  | Descripción |
|--------|-----------------|-------------------------|-------------|
| RNF01  | Seguridad       | Autenticación de acceso | El sistema debe requerir credenciales válidas para acceder a cualquier funcionalidad. |
| RNF02  | Usabilidad      | Interfaz amigable       | La interfaz debe ser simple e intuitiva. El tiempo de aprendizaje no debe superar los 5 minutos. |
| RNF03  | Performance     | Tiempo de respuesta     | Las operaciones deben responder en menos de 3 segundos bajo carga normal. |
| RNF04  | Portabilidad    | Compatibilidad web      | El sistema debe funcionar en cualquier navegador moderno (Chrome, Firefox, Edge). |
| RNF05  | Mantenibilidad  | Arquitectura modular    | El sistema debe estar estructurado en módulos independientes (backend y frontend separados). |
