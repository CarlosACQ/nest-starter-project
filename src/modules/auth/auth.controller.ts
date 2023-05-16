import { Controller, Get, Post, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';

import { User } from '../users/entities/user.entity';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { RefreshTokenService } from './refresh-token.service';
import { LocalAuthGuard } from './guards';
import { AUTH_COOKIES } from './constant';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService,
    private readonly refreshTokenService: RefreshTokenService) { }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  public async login(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const user = req.user as User;
    const accessToken = this.authService.generateAccessToken(user);
    const refreshToken = await this.refreshTokenService.generateRefreshToken(user);
    res.cookie(AUTH_COOKIES.ACCESS_TOKEN, accessToken, { httpOnly: true, sameSite: 'strict' });
    res.cookie(AUTH_COOKIES.REFRESH_TOKEN, refreshToken, { httpOnly: true, sameSite: 'strict' });
    return { message: "Login successful" };
  }


  @Post('refresh-token')
  async refreshToken(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies[AUTH_COOKIES.REFRESH_TOKEN];
    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token provided');
    }
    const token = await this.refreshTokenService.validateRefreshToken(refreshToken);
    const newAccessToken = this.authService.generateAccessToken(token.user);
    // const newRefreshToken = await this.refreshTokenService.generateRefreshToken(token.user);

    res.cookie(AUTH_COOKIES.ACCESS_TOKEN, newAccessToken, { httpOnly: true, sameSite: 'strict'  });
    // res.cookie(AUTH_COOKIES.REFRESH_TOKEN, newRefreshToken, { httpOnly: true });
    return {
      message: 'Access token refreshed successfully'
    };
  }

  @Post('logout')
  public async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies[AUTH_COOKIES.REFRESH_TOKEN];
    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token found');
    }
    await this.refreshTokenService.revokeByToken(refreshToken);
    res.clearCookie(AUTH_COOKIES.REFRESH_TOKEN);
    res.clearCookie(AUTH_COOKIES.ACCESS_TOKEN);

    return { message: 'User logged out successfully' };
  }

  
  @Get('user')
  public async user() {
    return [];
  }

}
