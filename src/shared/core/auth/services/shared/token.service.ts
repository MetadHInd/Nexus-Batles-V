// src/auth/services/token.service.ts
import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { ConfigConstants } from 'src/shared/constants/config.constants.enum';
import { GenericErrorMessages } from 'src/shared/constants/generic-error-messages.enum';
import { ErrorCodesEnum } from 'src/shared/errors/error-codes.enum';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TokenService {
  validateToken(token: string): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!token) return reject(new Error('Token is missing'));

      const secret = process.env.JWT_SECRET;
      if (!secret) {
        throw new Error(GenericErrorMessages.JWT_ENV_TOKEN_MISSING);
      }
      jwt.verify(token, secret, (err, decoded) => {
        if (err) {
          return reject(
            new Error(
              JSON.stringify({
                status: ErrorCodesEnum.UNAUTHORIZED,
                printMessage: GenericErrorMessages.INVALID_JWT_TOKEN,
              }),
            ),
          );
        }
        resolve(decoded);
      });
    });
  }

  generateToken(
    payload: string | object | Buffer,
    expiresIn = ConfigConstants.JWT_DEFAULT_EXPIREtIME,
  ): string {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error(GenericErrorMessages.JWT_ENV_TOKEN_MISSING);
    }
    return jwt.sign(payload, secret, { expiresIn } as jwt.SignOptions);
  }

  generateUUID(amount?: number, isHexa = true): string {
    if (amount && Number.isInteger(amount) && amount > 0) {
      return Array.from({ length: amount }, () =>
        isHexa
          ? Math.floor(Math.random() * 16).toString(16)
          : Math.floor(Math.random() * 10).toString(),
      ).join('');
    }
    return uuidv4();
  }
}
