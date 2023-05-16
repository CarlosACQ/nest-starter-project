import { Global, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';
import { authConfig } from '../../config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { CookieExtractor } from './strategies/cookie-extractor.helper';
import { RefreshToken } from './entities/refresh-token.entity';
import { RefreshTokenService } from './refresh-token.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Global()
@Module({
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, CookieExtractor, RefreshTokenService],
  imports: [UsersModule, PassportModule,
    TypeOrmModule.forFeature([RefreshToken]),
    JwtModule.registerAsync({
      inject: [authConfig.KEY],
      useFactory: (authConfiguration: ConfigType<typeof authConfig>) => {
        return {
          secret: authConfiguration.jwtAccessSecret,
          signOptions: {
            expiresIn: authConfiguration.tokenExpires,
          },
        };
      },
    }),],
  exports: [AuthService, CookieExtractor, RefreshTokenService],

})
export class AuthModule { }
