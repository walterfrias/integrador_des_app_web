# Onboarding — Sistema de Gestión de Proyectos
**UNER — Ingeniería de Software**  
**Rama base:** `develop`

---

## Setup inicial

### 1. Clonar y pararse en develop
```bash
git clone <url-del-repo>
cd integrador_des_app_web
git checkout develop
```

### 2. Levantar la base de datos
```bash
docker compose up -d
```
Levanta PostgreSQL en `localhost:5432`. Necesitás tener Docker corriendo.

### 3. Configurar el backend
```bash
cd back
cp .env.example .env   # si no existe, crear back/.env con esto:
```
```
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=cooperadora
DB_SSL=false
JWT_SECRET=secreto_local
JWT_EXPIRES_IN=8h
PORT=3000
```
```bash
npm install
npm run migration:run   # aplica las migraciones existentes
npm run seed            # carga datos de prueba (50 clientes, 20 proyectos, 51 tareas, 42 asignaciones)
npm run start:dev       # backend en localhost:3000
```

### 4. Configurar el frontend
```bash
cd front
npm install
npm start               # Angular en localhost:4200 con proxy a localhost:3000
```

### 5. Verificar que todo funciona
Abrí `http://localhost:4200` → debería aparecer el login.

**Usuarios cargados por el seed:**

| Email | Contraseña | Rol |
|---|---|---|
| admin@admin.com | adminintegrador | ADMIN |
| operador@prueba.com | operadorintegrador | OPERADOR |
| walter@prueba.com | walterintegrador | OPERADOR |
| lucia@prueba.com | luciaintegrador | OPERADOR |
| martin@prueba.com | martinintegrador | OPERADOR |
| sofia@prueba.com | sofiaintegrador | OPERADOR |

---

## Arquitectura en una página

```
front/src/app/
  core/
    services/        ← llamadas HTTP (un service por entidad)
    guards/          ← authGuard (protege rutas privadas)
    interceptors/    ← authInterceptor (agrega JWT a cada request)
  layout/            ← shell con sidebar (ya está, no tocar)
  auth/login/        ← única ruta pública (ya está)
  clientes/          ← ejemplo completo para copiar estructura
  <tu-modulo>/       ← acá va tu trabajo

back/src/modules/
  auth/              ← login JWT (no tocar)
  usuarios/          ← CRUD usuarios (no tocar)
  gestion/           ← acá va todo el negocio
    entities/        ← todas las entidades ya existen
    controllers/     ← algunos existen, ver estado abajo
    services/        ← algunos existen, ver estado abajo
    dtos/            ← todos existen (input + output)
    gestion.module.ts ← registrar tus controllers y services acá
```

**URL base del backend:** `http://localhost:3000/api/v1/`  
**Swagger (documentación de endpoints):** `http://localhost:3000/api`

---

## Estado actual del repo

| Módulo | Backend | Frontend |
|---|---|---|
| Auth (login) | ✅ completo | ✅ completo |
| Usuarios (RF13-RF16) | ✅ completo | ✅ completo |
| Clientes (RF06-RF09) | ✅ completo | ✅ completo |
| Estadísticas dashboard (RF20) | ✅ completo | ✅ completo |
| Asignaciones (RF28-RF30) | ✅ completo | ❌ pendiente |
| Proyectos (RF02-RF05, RF22) | ⚠️ controller existe, falta service | ❌ pendiente |
| Tareas (RF10-RF12) | ⚠️ controller existe, falta service | ❌ pendiente |
| Responsable de tarea (RF31-RF33) | ❌ pendiente | ❌ pendiente |
| Contactos (RF23-RF25) | ⚠️ entidad existe, falta controller+service | ❌ pendiente |
| Filtros y paginación (RF17-RF19) | ❌ pendiente | ❌ pendiente |
| Exportación CSV (RF26-RF27) | ❌ pendiente | ❌ pendiente |

---

## Tareas por integrante

### Integrante 2 — Contactos de clientes (RF23, RF24, RF25)

**Qué hay hecho:**
- Entidad `back/src/modules/gestion/entities/contacto.entity.ts` ✅
- DTOs en `back/src/modules/gestion/dtos/` ✅

**Qué tenés que hacer:**

*Backend:*
1. Crear `back/src/modules/gestion/services/contactos.service.ts`
2. Crear `back/src/modules/gestion/controllers/contactos.controller.ts`
   - Rutas anidadas: `GET/POST /clientes/:id/contactos`, `PUT/DELETE /clientes/:id/contactos/:contactoId`
3. Registrar en `gestion.module.ts` (controllers y providers)

*Frontend:*
1. Crear `front/src/app/core/services/contactos.service.ts`
2. Agregar sección de contactos dentro del detalle/edición de cliente

**Referencia:** mirá `clientes.service.ts` y `clientes.controller.ts` como modelo.

---

### Integrante 3 — Proyectos (RF02, RF03, RF04, RF05, RF22)

**Qué hay hecho:**
- Entidad `back/src/modules/gestion/entities/proyecto.entity.ts` ✅
- Controller `back/src/modules/gestion/controllers/proyectos.controller.ts` ✅ (existe pero no registrado)
- DTOs en `back/src/modules/gestion/dtos/` ✅

**Qué tenés que hacer:**

*Backend:*
1. Crear `back/src/modules/gestion/services/proyectos.service.ts`
2. Registrar controller y service en `gestion.module.ts`
3. RF22: en el listado, calcular si `fechaLimite < hoy && estado !== FINALIZADO`

*Frontend:*
1. Crear `front/src/app/core/services/proyectos.service.ts`
2. Crear `front/src/app/proyectos/lista-proyectos.ts`
3. Crear `front/src/app/proyectos/form-proyecto.ts`
4. Crear `front/src/app/proyectos/detalle-proyecto.ts` — **este componente es compartido**: Int. 4 agrega el kanban de tareas adentro e Int. 5 agrega la sección de asignaciones adentro. Crealo con la info básica del proyecto y dejá secciones marcadas con comentarios `<!-- TAREAS -->` y `<!-- ASIGNACIONES -->` para que los demás sepan dónde agregar.
5. Agregar rutas en `app.routes.ts` bajo `/app/proyectos`:
   - `/app/proyectos` → `lista-proyectos.ts`
   - `/app/proyectos/nuevo` → `form-proyecto.ts`
   - `/app/proyectos/:id/editar` → `form-proyecto.ts`
   - `/app/proyectos/:id` → `detalle-proyecto.ts`
6. Agregar ítem en el sidebar (`layout/main-layout.ts`)

**Referencia:** mirá `lista-clientes.ts` y `form-cliente.ts` como modelo exacto.

---

### Integrante 4 — Tareas + Responsable (RF10, RF11, RF12, RF21, RF31, RF32, RF33)

**Qué hay hecho:**
- Entidad `back/src/modules/gestion/entities/tarea.entity.ts` ✅ (incluye FK `usuario_id` nullable)
- Controller `back/src/modules/gestion/controllers/tareas1.controller.ts` ✅ (existe pero no registrado)
- DTOs en `back/src/modules/gestion/dtos/` ✅

**Qué tenés que hacer:**

*Backend — Tareas (RF10-RF12):*
1. Crear `back/src/modules/gestion/services/tareas.service.ts`
2. Registrar en `gestion.module.ts`
3. Rutas anidadas bajo proyecto: `POST /proyectos/:id/tareas`, `PUT /proyectos/:id/tareas/:tareaId`, `DELETE /proyectos/:id/tareas/:tareaId`

*Backend — Responsable (RF31-RF33):*
4. En el service: método `asignarResponsable(tareaId, usuarioId)` — validar que el usuario esté Activo
5. Método `quitarResponsable(tareaId)` — setea `usuario_id = null`
6. En el listado: soporte para filtro `?responsableId=` (RF33)
7. Endpoints sugeridos: `PATCH /proyectos/:id/tareas/:tareaId/responsable` y `DELETE /proyectos/:id/tareas/:tareaId/responsable`

*Frontend:*
1. Crear `front/src/app/core/services/tareas.service.ts`
2. Las tareas van dentro de `detalle-proyecto.ts` que crea Int. 3 — buscá el comentario `<!-- TAREAS -->` y agregá el kanban ahí
3. RF21 — Kanban: tres columnas (Pendiente / Finalizada / Baja), las tareas son tarjetas con botones de cambio de estado
4. RF31/RF32 — En cada tarjeta: selector de responsable (dropdown de usuarios activos) y botón para quitar

**Dependencia:** necesitás que Int. 3 tenga creado `detalle-proyecto.ts` y al menos el backend de proyectos listo para poder probar.

---

### Integrante 5 — Asignaciones frontend + Búsqueda + CSV (RF28-RF30, RF17-RF19, RF26, RF27)

**Qué hay hecho:**
- Backend RF28-RF30 completo: `GET/POST /asignaciones`, `PUT /asignaciones/:id` ✅
- RF20 completo: `GET /api/v1/stats` + dashboard con gráficos ✅

**Qué falta:**

*RF28-RF30 — Frontend asignaciones:*
- Las asignaciones van dentro de `detalle-proyecto.ts` que crea Int. 3
- Buscá el comentario `<!-- ASIGNACIONES -->` y agregá la sección ahí
- Crear `front/src/app/core/services/asignaciones.service.ts`
- Mostrar lista de usuarios asignados con botón para dar de baja
- Selector para agregar nuevo usuario al proyecto

*RF17-RF19 — Filtros y paginación:*
- Backend: agregar parámetros `?nombre=&estado=&page=&limit=` en los services de proyectos, clientes y tareas
- Frontend: agregar inputs de filtro y paginador en las listas existentes (PrimeNG tiene `p-paginator`)
- **Depende de que Int. 3 e Int. 4 tengan los listados listos**

*RF26-RF27 — Exportación CSV:*
- Backend: endpoint `GET /api/v1/proyectos/export` y `GET /api/v1/tareas/export` con header `Content-Type: text/csv`
- Frontend: botón "Exportar CSV" en los listados de proyectos y tareas

---

## Convención de Git

### Ramas
```bash
git checkout develop
git pull origin develop
git checkout -b feat/proyectos     # una rama por módulo
```

### Commits
Cada commit debe referenciar los RFs que cubre:
```
feat: listar y crear proyectos (RF02, RF03)
fix: validar fecha límite futura (RF03)
```

### Para mergear tu trabajo
```bash
git checkout develop
git pull origin develop
git merge feat/tu-rama
git push origin develop
```

---

## Cómo agregar una ruta nueva en el frontend

1. Crear el componente en `front/src/app/<modulo>/`
2. Agregar la ruta en `app.routes.ts` como hijo de `/app`:
```typescript
{
  path: 'proyectos',
  loadComponent: () => import('./proyectos/lista-proyectos').then(m => m.ListaProyectosComponent),
}
```
3. Agregar el ítem en el sidebar (`layout/main-layout.ts`)

## Cómo registrar un controller/service nuevo en el backend

En `back/src/modules/gestion/gestion.module.ts`:
```typescript
@Module({
  imports:     [TypeOrmModule.forFeature([Cliente, Proyecto, Tarea, ...]), AuthModule],
  controllers: [ClientesController, ProyectosController, TareasController, ...],  // agregar acá
  providers:   [ClientesService, ProyectosService, TareasService, ...],           // agregar acá
})
export class GestionModule {}
```

---
