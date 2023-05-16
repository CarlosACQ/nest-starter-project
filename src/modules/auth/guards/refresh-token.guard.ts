import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { RefreshTokenService } from '../refresh-token.service';
import { AUTH_COOKIES } from '../constant';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(private readonly refreshTokenService: RefreshTokenService) { }

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const refreshToken = request.cookies[AUTH_COOKIES.REFRESH_TOKEN];
    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token provided');
    }
    try {
      await this.refreshTokenService.validateRefreshToken(refreshToken);
      return true;
    } catch (err) {
      return false;
    }
  }
}