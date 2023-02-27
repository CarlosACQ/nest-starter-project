import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';

import { User } from '../users/entities/user.entity';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  public login(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const user = req.user as User;
    // const token = this.authService.generateJWT(user);
    // res.cookie('auth-cookie', token, { httpOnly: true });
    // return {
    //   status: HttpStatus.ACCEPTED,
    // };
  }
  @Get('user')
  public async user() {
    return [];
  }

  @Post('logout')
  public async logout() {
    return []
  }
}
