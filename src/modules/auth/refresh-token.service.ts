import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { LessThanOrEqual, Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

import { authConfig } from 'src/config';
import { RefreshToken } from './entities/refresh-token.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class RefreshTokenService {
  constructor(
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
    @Inject(authConfig.KEY)
    private readonly authConfiguration: ConfigType<typeof authConfig>,
    private jwtService: JwtService,
  ) { }

  public async generateRefreshToken(user: User): Promise<string> {
    const token = uuidv4();
    const refreshTokenExpiration = new Date();
    const { refreshTokenExpires } = this.authConfiguration;
    refreshTokenExpiration.setSeconds(refreshTokenExpiration.getSeconds() + refreshTokenExpires);
    const refreshToken = new RefreshToken();
    refreshToken.user = user;
    refreshToken.token = token;
    refreshToken.expiresIn = refreshTokenExpiration;
    await this.refreshTokenRepository.save(refreshToken);
    return token;
  }

  async findRefreshTokenById(id: string): Promise<RefreshToken> {
    return this.refreshTokenRepository.findOne({ where: { id } });
  }

  async findRefreshTokenByToken(token: string): Promise<RefreshToken> {
    return this.refreshTokenRepository.findOne({ where: { token } });
  }

  async deleteRefreshTokenById(id: string): Promise<void> {
    await this.refreshTokenRepository.delete({ id });
  }

  async deleteRefreshTokenByToken(token: string): Promise<void> {
    await this.refreshTokenRepository.delete({ token });
  }

  async deleteExpiredRefreshTokens(): Promise<void> {
    await this.refreshTokenRepository.delete({
      expiresIn: LessThanOrEqual(new Date()),
    });
  }

  async validateRefreshToken(token: string): Promise<RefreshToken> {
    const tokenEntity = await this.refreshTokenRepository.findOne({ where: { token } });
    if (!tokenEntity || tokenEntity.expiresIn < new Date()) {
      throw new UnauthorizedException('Refresh token is expired or not found');
    }
    return tokenEntity;
  }

  async revokeByToken(token: string): Promise<void> {
    const refreshToken = await this.refreshTokenRepository.findOne({
      where: { token },
    });

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is not found');
    }

    await this.refreshTokenRepository.remove(refreshToken);
  }

}