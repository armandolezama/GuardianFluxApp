# ADR 0002 — Monorepo

**Fecha:** 2025-11-22  
**Estado:** Accepted

## Contexto
El proyecto incluye backend y frontend que evolucionan juntos.

## Decisión
Usar monorepo con dos carpetas: `backend/` y `frontend/`.

## Razones
- Facilita versionado conjunto.
- Permite PRs que tocan ambos lados.
- Simplifica la entrega del portafolio.

## Consecuencias
- Scripts se ejecutan por proyecto.
- Más adelante puede adoptarse tooling de monorepo (Nx/Turbo) si crece.
