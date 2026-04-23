# Diagrama de Clases
**Sistema:** Gestión de Proyectos  
**Materia:** Ingeniería de Software — UNER  
**Notación:** UML — Mermaid (compatible draw.io)

---

## Importar en draw.io

1. Abrir draw.io → `Extras > Edit Diagram`
2. En el desplegable superior seleccionar **Mermaid**
3. Borrar el contenido existente y pegar el bloque de código de abajo
4. Click en **OK**

---

```mermaid
classDiagram
    class Usuario {
        +String username
        +String clave
        +EstadoUsuario estado
    }
    class Proyecto {
        +String nombre
        +EstadoProyecto estado
    }
    class Cliente {
        +String nombre
        +EstadoCliente estado
    }
    class Tarea {
        +String descripcion
        +EstadoTarea estado
    }
    class EstadoUsuario {
        <<enumeration>>
        Activo
        Baja
    }
    class EstadoProyecto {
        <<enumeration>>
        Activo
        Finalizado
        Baja
    }
    class EstadoCliente {
        <<enumeration>>
        Activo
        Baja
    }
    class EstadoTarea {
        <<enumeration>>
        Pendiente
        Finalizado
        Baja
    }
    Proyecto "0..*" --> "0..1" Cliente : tiene
    Proyecto "1" *-- "0..*" Tarea : contiene
    Usuario ..> EstadoUsuario : usa
    Proyecto ..> EstadoProyecto : usa
    Cliente ..> EstadoCliente : usa
    Tarea ..> EstadoTarea : usa
```

---

## Descripción de Relaciones

| Relación | Tipo | Cardinalidad | Descripción |
|----------|------|--------------|-------------|
| Proyecto → Cliente | Asociación | 0..* a 0..1 | Un proyecto puede tener un cliente o ninguno. Un cliente puede estar en varios proyectos. |
| Proyecto → Tarea | Composición | 1 a 0..* | Las tareas pertenecen a un proyecto. Si el proyecto se elimina, sus tareas también. |
| Usuario | Independiente | — | Los usuarios no tienen relación de propiedad con ninguna entidad (restricción R04). |

---

## Notas de diseño

- `Cliente` en estado `Baja` no puede ser asignado a nuevos proyectos (R01).
- `Cliente` solo puede pasar a estado `Baja` si no tiene proyectos asociados (R02).
- La relación `Proyecto → Cliente` es opcional: un proyecto puede ser interno (sin cliente).
