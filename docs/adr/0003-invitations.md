# ADR 0003 — Registro controlado por invitación

**Fecha:** 2025-11-22  
**Estado:** Accepted

## Contexto
Se requiere:
- acceso controlado (no signup abierto),
- usuarios demo para reclutadores.

## Decisión
El único flujo de registro disponible es por invitación:
- La invitación se genera por un ADMIN
- Es de un solo uso y tiene expiración
- Registro crea User + Account y marca invitación como USED

## Razones
- Simula un flujo bancario real de onboarding controlado.
- Evita que cualquiera entre a la demo.
- Permite crear usuarios temporales para reclutadores.

## Consecuencias
- Se implementará endpoint admin para crear invitaciones.
- Frontend tendrá pantalla `/activate` y luego `/register`.
