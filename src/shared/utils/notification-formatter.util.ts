// src/shared/utils/notification-formatter.util.ts
export class NotificationFormatter {
  static validatePhoneNumber(
    phone: string,
  ): { type: 'SMS'; value: string } | null {
    // Eliminar espacios, guiones y otros caracteres no numéricos excepto el +
    const cleanPhone = phone.replace(/[^\d+]/g, '');

    // Verificar que es un número válido (debe tener al menos 10 dígitos)
    if (cleanPhone.replace(/\+/g, '').length < 10) {
      return null;
    }

    // Asegurarse de que tenga prefijo internacional
    let formattedPhone = cleanPhone;
    if (!cleanPhone.startsWith('+')) {
      const defaultCountryCode = process.env.DEFAULT_COUNTRY_CODE || '+1';
      formattedPhone = defaultCountryCode + cleanPhone;
    }

    return { type: 'SMS', value: formattedPhone };
  }

  static validatePlayerId(
    playerId: string,
  ): { type: 'PUSH'; value: string } | null {
    // Verificar si es un UUID válido o un token de Firebase
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    const firebaseRegex = /^[a-zA-Z0-9_-]+:[a-zA-Z0-9_-]+$/;

    if (uuidRegex.test(playerId) || firebaseRegex.test(playerId)) {
      return { type: 'PUSH', value: playerId };
    }

    return null;
  }

  static validateTokenType(token: string): {
    type: 'SMS' | 'PUSH' | 'EMAIL';
    value: string;
  } {
    // Primero comprobar si es un email
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(token)) {
      return { type: 'EMAIL', value: token };
    }

    // Comprobar si es un número de teléfono
    const phoneValidation = this.validatePhoneNumber(token);
    if (phoneValidation) {
      return phoneValidation;
    }

    // Asumir que es un player ID para notificaciones push
    return { type: 'PUSH', value: token };
  }
}
