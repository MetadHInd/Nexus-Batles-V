import jwt, { SignOptions } from 'jsonwebtoken';
import { env } from '../../config/env';
import { ITokenService } from '../../application/usecases/auth/RegisterUser';

export class JwtTokenService implements ITokenService {
generate(payload: any): string {
  const options: SignOptions = {
    expiresIn: env.JWT_EXPIRES_IN as SignOptions['expiresIn'],
  };

  return jwt.sign(payload, env.JWT_SECRET, options);
}

generateRefreshToken(payload: any): string {
  const options: SignOptions = {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN as SignOptions['expiresIn'],
  };

  return jwt.sign(payload, env.JWT_REFRESH_SECRET, options);
}

  verify(token: string): any {
    try {
      return jwt.verify(token, env.JWT_SECRET);
    } catch (error) {
      
      return null;
    }
  }

  verifyRefreshToken(token: string): any {
    try {
      return jwt.verify(token, env.JWT_REFRESH_SECRET);
    } catch (error) {
     
      return null;
    }
  }
}