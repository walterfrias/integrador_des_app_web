# Estado del Frontend — Sistema de Gestión de Proyectos
**Fecha:** 08/05/2026  
**Stack:** Angular 21 + PrimeNG + Tailwind v4  
**Deploy:** Vercel (proxy → Render backend)

---

## ✅ COMPLETADO (Walter)

### Infraestructura
- Configuración Tailwind v4 + PrimeNG Aura
- Proxy dev (`proxy.conf.json`) → `localhost:3000`
- Proxy prod (`vercel.json`) → `https://integrador-des-app-web.onrender.com`
- Dockerfile + nginx.conf (listo para migrar de Vercel a Render)  
- Dark mode persistente (localStorage)

### Autenticación
- **CN01 — Login** ✅ (RF01)
  - Formulario con nombre + clave
  - JWT guardado en localStorage
  - Redirección automática si ya está logueado

### Core
- `AuthService` — login, logout, getToken, getUsuario (decode JWT)
- `AuthInterceptor` — adjunta Bearer token a cada request
- `AuthGuard` — protege rutas privadas

### Layout
- Sidebar colapsable con navegación
- Topbar con toggle dark mode y botón salir
- Router outlet para páginas hijas

### Dashboard
- **CN02 — Dashboard** ✅ (base)
  - Saludo con nombre y rol del usuario
  - Cards de acceso a módulos (filtra Usuarios si no es ADMIN)
  - Placeholder de estadísticas (pendiente E03)

### Gestión de Usuarios (solo ADMIN)
- **CN09 — Lista de Usuarios** ✅ (RF13, RF16)
  - Tabla con nombre, rol, estado
  - Botón dar de baja con confirmación
- **CN10 — Formulario de Usuario** ✅ (RF14, RF15)
  - Crear y editar en el mismo componente
  - Contraseña opcional al editar

---

## ❌ PENDIENTE (según división de tareas)

### Integrante 2 — Clientes + Contactos
- **CN06 — Lista de Clientes** (RF06, RF09, RF18)
- **CN07 — Formulario de Cliente** (RF07, RF08, RF23, RF24, RF25)

### Integrante 3 — Proyectos
- **CN03 — Lista de Proyectos** (RF02, RF17, RF22, RF26)
- **CN04 — Detalle de Proyecto** (RF05)
- **CN05 — Formulario de Proyecto** (RF03, RF04)

### Integrante 4 — Tareas
- **CN08 — Formulario de Tarea** (RF10, RF11, RF12)
- Panel Kanban en CN04 (RF21)
- Exportar tareas CSV (RF27)

### Integrante 5 — Stats + CSV (depende de los demás)
- **CN02 — Dashboard estadísticas** (RF20)
- Filtros/paginación avanzada (RF17, RF18, RF19)
- Exportar proyectos CSV (RF26)

---

## Estructura de carpetas

```
src/app/
  auth/login/          ← LoginComponent
  core/
    services/          ← AuthService, UsuariosService
    interceptors/      ← authInterceptor
    guards/            ← authGuard
  layout/main-layout/  ← MainLayoutComponent
  dashboard/           ← DashboardComponent
  usuarios/            ← ListaUsuariosComponent, FormUsuarioComponent
  shared/components/   ← (vacío, para componentes reutilizables del equipo)
```

## Rutas registradas

```
/login                    → LoginComponent
/app                      → MainLayoutComponent (protegido)
  /app/dashboard          → DashboardComponent
  /app/usuarios           → ListaUsuariosComponent
  /app/usuarios/nuevo     → FormUsuarioComponent
  /app/usuarios/:id/editar→ FormUsuarioComponent
```

## Convención para el equipo

- Cada módulo nuevo va en su propia carpeta bajo `src/app/`
- Registrar rutas hijas bajo `/app` en `app.routes.ts`
- Servicios de API van en `core/services/`
- Commits deben referenciar RFs: `feat: descripción (RF02, RF03)`
- Trabajar en rama propia → mergear a `develop` → `develop` → `main` (producción)
