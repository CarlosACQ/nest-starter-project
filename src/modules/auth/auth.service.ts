import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

import { DisabledUserException, InvalidCredentialsException } from 'src/common/http/exceptions';
import { UserStatus } from '../users/enums';
import { ErrorType } from 'src/common/enums';
import { HashUtil } from 'src/common/utils/hash.util';
import { User } from '../users/entities/user.entity';
import { IPayloadToken } from './interfaces/payloadToken.interface';
import { RefreshTokenService } from './refresh-token.service';
import { AUTH_COOKIES } from './constant';


@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {

  }
  public async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersService.getUserByEmail(email);
    if (!user) {
      throw new InvalidCredentialsException();
    }
    const passwordMatch = await HashUtil.compare(password, user.password);
    if (!passwordMatch) {
      throw new InvalidCredentialsException();
    }
    if (user.status === UserStatus.Blocked || user.status === UserStatus.Inactive) {
      const errorType = user.status === UserStatus.Blocked ? ErrorType.BlockedUser : ErrorType.InactiveUser;
      throw new DisabledUserException(errorType);
    }
    return user;
  }


  public generateAccessToken(user: User) {
    const payload: IPayloadToken = { id: user.id, email: user.email };
    const token = this.jwtService.sign(payload);
    return token;
  }


  async getUserIdFromAccessToken(request: Request): Promise<number> {
    const cookie = request.cookies[AUTH_COOKIES.ACCESS_TOKEN];
    const data = await this.jwtService.verifyAsync(cookie);
    return data['id'];
  }

}
