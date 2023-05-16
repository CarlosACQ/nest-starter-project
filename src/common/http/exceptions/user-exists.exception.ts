import { ConflictException } from '@nestjs/common';
import { ErrorType } from '../../enums';

export class UserExistsException extends ConflictException {
  constructor(email: string) {
    super({
      errorType: ErrorType.UserExists,
      message: `Ya existe un usuario con el email '${email}'`,
    });
  }
}
