import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { ConfigConstants } from 'src/shared/constants/config.constants.enum';
import { GenericErrorMessages } from 'src/shared/constants/generic-error-messages.enum';
import { formatMessage } from 'src/shared/utils/message-formatter';

@Injectable()
export class PasswordService {
  async hashPassword(password: string): Promise<string> {
    const requiredLength = Number(ConfigConstants.PASSWORD_REQUIRED_SIZE);

    if (!password || password.length < requiredLength) {
      throw new Error(
        formatMessage(
          GenericErrorMessages.PASSWORD_REQUIRED_SIZE,
          requiredLength,
        ),
      );
    }

    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  async validatePassword(plain: string, hashed: string): Promise<boolean> {
    return await bcrypt.compare(plain, hashed);
  }
}
