import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtSecretProvider {
  private secret: string;

  constructor() {
    // Inicializar con el valor actual del environment
    this.secret = process.env.JWT_SECRET || 'your-secret-key';
  }

  setSecret(secret: string) {
    this.secret = secret;
  }

  getSecret(): string {
    return this.secret;
  }
}
