# GuardianFlux Backend

Backend NestJS para GuardianFlux.  
Diseñado con **Arquitectura Limpia** y **TDD**.

---

## Cómo correr

```bash
npm install
npm run start:dev
```

Servidor:
`http://localhost:3000`

---

## Scripts útiles

```bash
npm run start:dev   # desarrollo
npm run test        # pruebas unitarias (dominio y casos de uso)
npm run lint        # linting
```

---

## Variables de entorno (fase actual)

Por ahora se usan valores de desarrollo dentro del módulo.  
Más adelante se moverán a `.env`.

- `JWT_SECRET` (planeado)
- `JWT_EXPIRES_IN` (planeado)
- `MONGO_URI` (planeado)

---

## Endpoints disponibles

### Auth

#### POST `/auth/register-with-invitation`

Registro controlado por invitación.  
Crea **User + Account** y devuelve JWT.

Headers:
```http
Content-Type: application/json
```

Body:
```json
{
  "code": "INV-OK",
  "name": "Armando",
  "email": "armando@example.com",
  "password": "secret123"
}
```

Respuesta 200:
```json
{
  "accessToken": "<JWT>",
  "user": { "...": "..." },
  "account": { "...": "..." }
}
```

Errores:
- 400 Invitation expired / used
- 400 Email already in use

---

#### POST `/auth/login`

Headers:
```http
Content-Type: application/json
```

Body:
```json
{
  "email": "armando@example.com",
  "password": "secret123"
}
```

Respuesta 200:
```json
{
  "accessToken": "<JWT>",
  "user": { "...": "..." }
}
```

Errores:
- 400 Credenciales inválidas

---

### Movements (requiere JWT)

> Todos los endpoints de movimientos requieren:
```http
Authorization: Bearer <JWT>
Content-Type: application/json
```

#### POST `/movements/deposit`

Body:
```json
{
  "originAccountNumber": "ACC-1000",
  "destinationAccountNumber": "ACC-1001",
  "amount": 150,
  "description": "Test transfer"
}
```

Errores:
- 401 Unauthorized (sin token)
- 400 Amount <= 0
- 400 Destination not found
- 400 Insufficient funds
- 403 Unauthorized account access (origen no pertenece al usuario)

---

#### POST `/movements/withdraw`

Body:
```json
{
  "accountId": "acc-1",
  "amount": 100,
  "description": "ATM"
}
```

Errores:
- 401 Unauthorized (sin token)
- 400 Amount <= 0
- 400 Account not found
- 400 Insufficient funds
- 403 Unauthorized account access (cuenta no pertenece al usuario)

---

## Notas de desarrollo

- Repositorios actuales son **in-memory**.
- Pruebas unitarias cubren:
  - validación y uso de invitaciones
  - registro con invitación
  - depósitos / retiros
  - errores de negocio

---

## Próximos pasos

1. Endpoints admin:
   - `POST /admin/invitations`
   - `GET /admin/invitations`
2. Persistencia MongoDB
3. `/accounts/me`
4. Listado de movimientos
