# ADR 0001 — Tech Stack

**Fecha:** 2025-11-22  
**Estado:** Accepted

## Contexto
GuardianFlux es un banco demo de portafolio que debe crecer a una versión desplegable en AWS.  
Se busca productividad en MVP, pero sin sacrificar escalabilidad.

## Decisión
- Backend: NestJS + TypeScript
- Frontend: React + TypeScript + MUI + Vite
- DB inicial: MongoDB (Atlas) planeada
- Auth inicial: JWT local migrable a Cognito

## Razones
- Nest y React son ampliamente usados en mercado y alinean el perfil fullstack.
- TypeScript mejora mantenibilidad y es consistente en ambas capas.
- Mongo permite velocidad de MVP; arquitectura limpia permite migrar sin reescritura masiva.
- JWT local permite desarrollo sin depender de AWS; Cognito se integrará en fase cloud.

## Consecuencias
- Se separa dominio/aplicación/infra para minimizar refactors de infraestructura.
- Al migrar a Cognito habrá que sustituir estrategia JWT y desactivar login local de producción.
