import { PushService } from '../../../../messaging/push/services/push.service';
import { PushMessage } from '../../../../messaging/push/interfaces/push-message.interface';
import { PushResult } from '../../../../messaging/push/interfaces/push-result.interface';

export interface WithPush {
  pushService?: PushService;
  send(message: PushMessage): Promise<PushResult>;
  validateConfig(): boolean;
}

export class PushMixin {
  public pushService?: PushService;

  async send(message: PushMessage): Promise<PushResult> {
    if (!this.pushService) {
      throw new Error('PushService not initialized');
    }
    return await this.pushService.send(message);
  }



  validateConfig(): boolean {
    return !!this.pushService;
  }
}

export function WithPush<T extends new (...args: any[]) => {}>(Base: T) {
  return class extends Base implements WithPush {
    pushService?: PushService;

    async send(message: PushMessage): Promise<PushResult> {
      const mixin = new PushMixin();
      mixin.pushService = this.pushService;
      return await mixin.send(message);
    }

    validateConfig(): boolean {
      return !!this.pushService;
    }
  };
}
