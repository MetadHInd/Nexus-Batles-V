# WebSocket System (Generic & Scalable)

Este módulo provee una arquitectura genérica y escalable para WebSockets en TexelSync.  
Permite crear nuevos tipos de sockets y eventos fácilmente, con tipado fuerte para los datos transferidos.

## Estructura

- **gateways/**: Gateways WebSocket genéricos/extensibles.
- **events/**: Definición y tipado de todos los eventos de entrada/salida.
- **registry/**: Registro central de eventos y tipos.
- **interfaces/**: Contratos para eventos, payloads y handlers.

## ¿Cómo agregar un nuevo tipo de socket/evento?

1. Define el tipo y payload en `events/`.
2. Regístralo en `registry/socket-events.registry.ts`.
3. Extiende el gateway genérico en `gateways/` o crea uno nuevo.
4. Implementa la lógica y handlers usando los tipos definidos.

## Ejemplo de uso

```ts
// Enviar un evento tipado
this.server.emit(SocketEventTypes.USER_MESSAGE, {
  userId: '...',
  message: 'Hola',
});
```

## Ventajas

- Tipado fuerte en todos los eventos y payloads.
- Registro centralizado de eventos.
- Fácil extensión para nuevos tipos de sockets.
- Integrable con ServiceCache y otros módulos core.
