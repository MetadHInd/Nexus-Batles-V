# Historia de Usuario — Rutas de API Gateway para Subastas

| Campo      | Detalle |
|------------|---------|
| **ID**     | HU-SUBASTAS-001 |
| **Rol**    | Desarrollador |
| **Módulo** | Subastas / API Gateway |
| **Estado** | Implementada |

---

## Descripción

> Como **desarrollador**, quiero contar con rutas definidas en el API Gateway para
> todas las operaciones de subastas para que los microservicios y el frontend
> consuman los endpoints correctamente.

---

## Endpoints Registrados

| Método   | Ruta                          | Acceso    | Descripción |
|----------|-------------------------------|-----------|-------------|
| `GET`    | `/api/v1/auctions`            | Público   | Listar subastas activas (paginado) |
| `GET`    | `/api/v1/auctions/:id`        | Público   | Detalle de una subasta |
| `POST`   | `/api/v1/auctions`            | ADMIN     | Publicar nueva subasta |
| `DELETE` | `/api/v1/auctions/:id`        | ADMIN     | Cancelar subasta |
| `POST`   | `/api/v1/auctions/:id/pujas`  | Autent.   | Realizar una puja |
| `GET`    | `/api/v1/auctions/:id/pujas`  | Público   | Historial de pujas |

---

## Criterios de Aceptación

| # | Criterio | Implementación |
|---|----------|----------------|
| CA-1 | Todas las rutas del módulo registradas en el API Gateway. | `auctionRoutes.ts` — 6 rutas definidas, montadas en `server.ts` bajo `/api/v1/auctions`. |
| CA-2 | Rutas protegidas requieren token JWT válido en `Authorization` header. | `authMiddleware` aplicado en POST, DELETE y POST /pujas. |
| CA-3 | El API Gateway valida el formato del token antes de redirigir. | `authMiddleware` verifica y decodifica el JWT; retorna 401 si es inválido antes de llegar al controlador. |
| CA-4 | Códigos HTTP estándar: 200, 201, 400, 401, 403, 404, 500. | Cada endpoint del `AuctionController` retorna el código correcto; errores de dominio mapeados por `errorHandler`. |
| CA-5 | Rutas documentadas en Swagger/OpenAPI. | `docs/swagger/auctions.openapi.yaml` — spec completo OpenAPI 3.0.3. |

---

## Archivos Implementados

```
backend/src/
├── application/usecases/auctions/
│   ├── PlaceBidUseCase.ts          ← existente
│   ├── ListAuctionsUseCase.ts      ← nuevo
│   ├── GetAuctionUseCase.ts        ← nuevo
│   ├── CreateAuctionUseCase.ts     ← nuevo
│   ├── CancelAuctionUseCase.ts     ← nuevo
│   └── GetBidHistoryUseCase.ts     ← nuevo
└── infrastructure/http/
    ├── controllers/
    │   └── AuctionController.ts    ← nuevo
    └── routes/
        └── auctionRoutes.ts        ← reemplaza stubs 501

docs/
├── swagger/
│   └── auctions.openapi.yaml       ← nuevo (OpenAPI 3.0.3)
└── historias-usuario/
    └── HU-rutas-api-gateway-subastas.md
```

---

## Flujo de una Petición

```
Cliente
  │
  ▼  Authorization: Bearer <JWT>
GET /api/v1/auctions/:id/pujas
  │
  ├─ authMiddleware          → valida JWT, extrae userId/rol  → 401 si inválido
  ├─ validate(placeBidSchema) → valida body con Zod           → 400 si falla
  │
  ▼
AuctionController.placeBid()
  │
  ▼
PlaceBidUseCase.execute()
  ├─ AuctionRepository.findById()   → 404 si no existe
  ├─ PlayerRepository.findById()    → 404 si no existe
  ├─ AuctionDomainService.validateBid()
  └─ AuctionRepository.placeBid()
  │
  ▼
HTTP 201 — Auction actualizada con la nueva puja
```

---

## Protección JWT (CA-2 y CA-3)

El middleware `authMiddleware` (en `authMiddleware.ts`) ejecuta los siguientes pasos antes de que la petición llegue al controlador:

1. Extrae el header `Authorization: Bearer <token>`
2. Verifica la firma con `JwtTokenService.verify()`
3. Si el token es inválido, expirado o ausente → retorna **HTTP 401** inmediatamente
4. Si el rol no coincide con `requireRole('ADMIN')` → retorna **HTTP 403**
5. Solo si todo es válido → llama a `next()` y el controlador procesa la petición

---

## Documentación OpenAPI

El archivo `docs/swagger/auctions.openapi.yaml` contiene la especificación completa
en formato OpenAPI 3.0.3, incluyendo:
- Schemas de `Auction`, `Bid`, `BidHistory`, `Error`
- Security scheme `BearerAuth` (JWT)
- Todos los endpoints con parámetros, request bodies y respuestas posibles
