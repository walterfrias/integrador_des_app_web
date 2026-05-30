# Sistema de Gestión de Proyectos

Trabajo Práctico Integrador — UNER Ingeniería de Software  
Stack: NestJS + Angular + PostgreSQL

---

## Requisitos

- **Node.js 20+** → [descargar](https://nodejs.org/)
- **Docker Desktop** → [descargar](https://www.docker.com/products/docker-desktop/)
- **npm** (viene con Node.js)

---

## 🚀 Guía rápida (para el docente)

Seguí estos pasos **en orden** desde una terminal (PowerShell, CMD o Git Bash):

### 1. Base de datos (PostgreSQL + pgAdmin)

```bash
docker compose up -d
```

Esto levanta:
- **PostgreSQL** en `localhost:5432`
- **pgAdmin** en `http://localhost:5050`  
  (usuario: `admin@admin.com` — contraseña: `admin`)

> ⚠️ Esperá unos segundos hasta que PostgreSQL esté listo.

#### 🔧 Configurar pgAdmin (solo la primera vez)

1. Ingresá a [http://localhost:5050](http://localhost:5050) con `admin@admin.com` / `admin`
2. Hacé clic en **Add New Server**
3. Pestaña **General** → Name: `TPI Integrador` (o el nombre que quieras)
4. Pestaña **Connection**:
   - **Host:** `db` (nombre del servicio de Docker)
   - **Port:** `5432`
   - **Username:** `postgres`
   - **Password:** `postgres`
   - **Save password:** ✅ marcado
5. Hacé clic en **Save**

### 2. Backend

```bash
cd back
npm install
npm run migration:run
npm run seed
npm run start:dev
```

> El comando `npm run seed` crea los datos iniciales, incluyendo el **usuario administrador** y varios clientes, proyectos, tareas y asignaciones de ejemplo.

- API disponible en: `http://localhost:3000`
- Documentación Swagger: `http://localhost:3000/api`

### 3. Frontend

**Abrí otra terminal** y ejecutá:

```bash
cd front
npm install
npm start
```

- Frontend disponible en: `http://localhost:4200`

### 4. Acceder al sistema

El seed crea estos usuarios para ingresar:

| Usuario     | Contraseña        | Rol     |
|-------------|-------------------|---------|
| admin@admin.com | `adminintegrador` | Admin   |
| operador@prueba.com | `operadorintegrador` | Operador |

---

## 📋 Flujo completo (resumen)

```powershell
# 1. Base de datos
docker compose up -d

# 2. Backend
cd back
npm install
npm run migration:run
npm run seed
npm run start:dev

# 3. Frontend (nueva terminal)
cd front
npm install
npm start
```

---

## Variables de entorno

El archivo `back/.env` ya viene configurado con valores por defecto.  
Si querés modificarlos, editá ese archivo:

```
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=cooperadora
DB_SSL=false
JWT_SECRET=secreto_entregable
JWT_EXPIRES_IN=8h
SWAGGER_HABILITADO=true
PORT=3000
```

---

## Comandos backend

### Desarrollo

```bash
npm run start:dev      # dev con hot-reload
npm run build          # compilar
npm run start:prod     # producción
npm run lint           # ESLint con autofix
```

### TypeORM — Migraciones

```bash
npm run migration:generate   # generar migración a partir de cambios en entidades
npm run migration:run        # aplicar migraciones pendientes
npm run migration:revert     # revertir la última migración
```

### Seed y docs

```bash
npm run seed           # poblar datos iniciales
npm run compodoc       # documentación en http://localhost:8081
```

### Tests

```bash
npm test               # unit tests (Jest)
npm run test:e2e       # tests end-to-end
npm run test:cov       # cobertura
```

---

## Comandos frontend

```bash
npm start              # ng serve en puerto 4200
npm run build          # build de producción
npm test               # tests (Vitest)
```

---

## Deploy

| Servicio  | Plataforma | Rama   |
|-----------|------------|--------|
| Backend   | Render     | main   |
| Frontend  | Vercel     | main   |

Cada push a `main` deploya automáticamente.

---

## Flujo de ramas

```
walter / [rama-compañero] → develop → main
```
