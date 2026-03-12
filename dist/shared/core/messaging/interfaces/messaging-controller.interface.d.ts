export interface IMessagingController {
    send(message: any): Promise<any>;
    sendBulk(messageList: any[]): Promise<any>;
}
