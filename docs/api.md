# GuardianFlux API Cookbook

Este documento lista cómo probar el backend con Postman/cURL.

---

## Auth

### Register with invitation
`POST /auth/register-with-invitation`

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

OK 200 → devuelve JWT, usuario y cuenta.  
Errores 400 → invitación inválida/expirada/usada, o email duplicado.

---

### Login
`POST /auth/login`

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

OK 200 → devuelve JWT + user.  
Errores 400 → credenciales inválidas.

---

## Movements (requieren JWT)

Headers comunes:
```http
Authorization: Bearer <JWT>
Content-Type: application/json
```

### Deposit
`POST /movements/deposit`

Body:
```json
{
  "originAccountNumber": "ACC-1000",
  "destinationAccountNumber": "ACC-1001",
  "amount": 250,
  "description": "Pago"
}
```

Errores:
- 401 sin token
- 400 amount inválido / cuentas inexistentes / fondos insuficientes
- 403 origin no pertenece al usuario

---

### Withdraw
`POST /movements/withdraw`

Body:
```json
{
  "accountId": "acc-1",
  "amount": 100,
  "description": "ATM"
}
```

Errores:
- 401 sin token
- 400 amount inválido / cuenta inexistente / fondos insuficientes
- 403 account no pertenece al usuario
