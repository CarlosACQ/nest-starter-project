import { NotFoundException } from '@nestjs/common';
import { ErrorType } from '../../enums';

export class UserNotFoundException extends NotFoundException {
  constructor(email: string) {
    super({
      errorType: ErrorType.UserNotFound,
      message: `Usuario con email '${email}' no encontrado`,
    });
  }
}