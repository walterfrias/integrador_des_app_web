# Sistema de Gestión de Proyectos

Trabajo Práctico Integrador — UNER Ingeniería de Software  
Stack: NestJS + Angular + PostgreSQL

---

## Requisitos

- Node.js 20+
- Docker (Opcional)
- npm

---

## Levantar el proyecto

### 1. Base de datos

```bash
docker compose up -d
```

### 2. Backend (desde `back/`)

```bash
cd back
npm install
npm run migration:run
npm run start:dev
```

Disponible en: `http://localhost:3000`  
Swagger (docs API): `http://localhost:3000/api`

### 3. Frontend (desde `front/`)

```bash
cd front
npm install
npm start
```

Disponible en: `http://localhost:4200`

---

## Variables de entorno

Crear el archivo `back/.env`:

```
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=cooperadora
DB_SSL=false
JWT_SECRET=secreto
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
develop / [rama-compañero] → develop → main
```
