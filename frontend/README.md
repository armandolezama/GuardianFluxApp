# GuardianFlux Frontend

Frontend React + TypeScript con Material UI para GuardianFlux.

---

## Cómo correr

```bash
npm install
npm run dev
```

Frontend:
`http://localhost:5173`

---

## Rutas

- `/` Home / landing interna
- `/activate` Activar invitación (placeholder UI)
- `/register` Registro con invitación (placeholder UI)
- `/dashboard` Dashboard de cliente (placeholder UI)
- `/monitor` Panel de monitoreo (placeholder UI)

---

## UI / Tema

- Tema corporativo Light/Dark definido en `src/theme.ts`
- **Brand accent**: rojo
- Primary: azul confianza
- Secondary: dorado premium
- Fondos: blanco/grises en light, negro/azul oscuro en dark

---

## Próximos pasos

- Formularios reales para `/activate` y `/register`
- Conexión a backend (auth + movimientos)
- Dashboard con datos reales (`/accounts/me`, `/movements/my`)
