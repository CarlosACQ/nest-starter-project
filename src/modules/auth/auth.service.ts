import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { DisabledUserException, InvalidCredentialsException } from 'src/common/http/exceptions';
import { UserStatus } from '../users/enums';
import { ErrorType } from 'src/common/enums';
import { HashUtil } from 'src/common/utils/hash.util';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService
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
}
