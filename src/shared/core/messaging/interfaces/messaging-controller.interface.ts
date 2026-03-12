export interface IMessagingController {
  /**
   * Envía un mensaje a través del canal de comunicación
   * @param message Estructura del mensaje específica para el canal
   * @returns Resultado de la operación de envío
   */
  send(message: any): Promise<any>;

  /**
   * Envía un mensaje masivo a múltiples destinatarios
   * @param messageList Lista de mensajes a enviar
   * @returns Resultado de las operaciones de envío
   */
  sendBulk(messageList: any[]): Promise<any>;
}
