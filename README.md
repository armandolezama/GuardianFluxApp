# GuardianFlux

GuardianFlux es una aplicación bancaria de portafolio diseñada como **MVP escalable**.  
Simula un banco real con: cuentas de débito, depósitos entre usuarios, retiros, roles (cliente, monitor, admin) y un flujo de acceso controlado por invitaciones.

> Objetivo del proyecto: demostrar dominio de arquitectura limpia, TDD, NestJS, React + MUI, y un camino claro de migración a AWS.

---

## Stack

**Backend**
- NestJS (TypeScript)
- Arquitectura limpia (dominio / aplicación / infraestructura)
- TDD con repositorios in-memory
- JWT auth (Passport-ready)
- MongoDB (planeado para fase próxima)

**Frontend**
- React + TypeScript (Vite)
- Material UI (MUI)
- React Router
- Tema corporativo Light/Dark

---

## Estructura del monorepo

```
guardianflux/
  backend/
  frontend/
```

---

## Cómo correr el proyecto (local)

### Backend

```bash
cd backend
npm install
npm run start:dev
```

Backend por defecto en:
`http://localhost:3000`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend por defecto en:
`http://localhost:5173`

---

## Funcionalidad actual (MVP)

- Registro solo con invitación (`/auth/register-with-invitation`)
- Login con email/password (`/auth/login`)
- JWT para proteger movimientos
- Depósitos entre cuentas propias → destino cualquiera válido
- Retiros solo desde cuentas propias
- Roles y guardias base (JWT + roles guard listo)
- UI base con rutas: `/`, `/activate`, `/register`, `/dashboard`, `/monitor`

---

## Camino de escalamiento

- Persistencia real con MongoDB Atlas
- Endpoints admin para crear invitaciones
- Listado de cuentas del usuario (`/accounts/me`)
- Listado de movimientos (cliente y monitor)
- Migración a AWS (EC2/S2) y Cognito (fase futura)

---

## Licencia

Proyecto de portafolio / demostración técnica.
