# 📄 Requerimientos del Sistema 

## 🔹 1. Requerimientos Funcionales (RF)

| ID | Requerimiento | Descripción |
|----|-------------|------------|
| RF01 | Autenticación de usuarios | El sistema debe permitir a los usuarios ingresar mediante nombre de usuario y clave |
| RF02 | Registrar usuario | El sistema debe permitir crear nuevos usuarios |
| RF03 | Modificar usuario | El sistema debe permitir actualizar datos de usuarios |
| RF04 | Consultar usuario | El sistema debe permitir visualizar información de usuarios |
| RF05 | Eliminar usuario | El sistema debe permitir eliminar o dar de baja usuarios |
| RF06 | Cambiar estado de usuario | El sistema debe permitir cambiar el estado (Activo/Baja) de un usuario |

| RF07 | Crear proyecto | El sistema debe permitir crear nuevos proyectos |
| RF08 | Modificar proyecto | El sistema debe permitir actualizar datos de proyectos |
| RF09 | Consultar proyecto | El sistema debe permitir visualizar proyectos y su detalle |
| RF10 | Eliminar proyecto | El sistema debe permitir eliminar o dar de baja proyectos |
| RF11 | Cambiar estado de proyecto | El sistema debe permitir cambiar el estado de un proyecto |
| RF12 | Asociar cliente a proyecto | El sistema debe permitir asignar un cliente a un proyecto |
| RF13 | Consultar tareas de un proyecto | El sistema debe permitir visualizar las tareas de un proyecto |

| RF14 | Registrar cliente | El sistema debe permitir crear nuevos clientes |
| RF15 | Modificar cliente | El sistema debe permitir actualizar datos de clientes |
| RF16 | Consultar cliente | El sistema debe permitir visualizar clientes |
| RF17 | Eliminar cliente | El sistema debe permitir eliminar clientes |

| RF18 | Crear tarea | El sistema debe permitir agregar tareas a un proyecto |
| RF19 | Modificar tarea | El sistema debe permitir actualizar tareas |
| RF20 | Consultar tarea | El sistema debe permitir visualizar tareas |
| RF21 | Eliminar tarea | El sistema debe permitir eliminar tareas |
| RF22 | Cambiar estado de tarea | El sistema debe permitir cambiar el estado de una tarea |

---

## 🔹 2. Requerimientos No Funcionales (RNF)

| ID | Categoría | Requerimiento | Descripción |
|----|----------|-------------|------------|
| RNF01 | Seguridad | Autenticación | El sistema debe requerir autenticación para acceder |
| RNF02 | Seguridad | Gestión de credenciales | Las contraseñas deben almacenarse de forma segura |
| RNF03 | Usabilidad | Interfaz intuitiva | El sistema debe ser fácil de usar |
| RNF04 | Disponibilidad | Acceso | El sistema debe estar disponible para los usuarios autorizados |
| RNF05 | Rendimiento | Tiempo de respuesta | Las operaciones deben responder en tiempos aceptables |
| RNF06 | Mantenibilidad | Código estructurado | El sistema debe ser modular y fácil de mantener |
| RNF07 | Escalabilidad | Crecimiento | El sistema debe soportar aumento de usuarios y datos |
| RNF08 | Integridad | Consistencia de datos | El sistema debe garantizar datos consistentes |
| RNF09 | Persistencia | Almacenamiento | La información debe persistirse en una base de datos |
| RNF10 | Portabilidad | Acceso web | El sistema debe poder ejecutarse en navegadores web modernos |

---

## 🔹 3. Restricciones del Sistema (RN)

| ID | Restricción | Descripción |
|----|------------|------------|
| RN01 | Estado de usuario | Un usuario solo puede estar en estado Activo o Baja |
| RN02 | Estado de cliente | Un cliente solo puede estar en estado Activo o Baja |
| RN03 | Estado de proyecto | Un proyecto solo puede estar en estado Activo, Finalizado o Baja |
| RN04 | Estado de tarea | Una tarea solo puede estar en estado Pendiente, Finalizado o Baja |
| RN05 | Cliente activo | Solo se pueden asignar clientes en estado Activo a un proyecto |
| RN06 | Cliente sin proyectos | No se puede eliminar un cliente si está asociado a proyectos |
| RN07 | Proyecto interno | Un proyecto puede no tener cliente asociado |
| RN08 | Tareas obligatorias | Un proyecto debe tener al menos una tarea |
| RN09 | Dependencia de tarea | Una tarea debe pertenecer a un proyecto |
| RN10 | Acceso al sistema | Solo usuarios con estado Activo pueden acceder al sistema |