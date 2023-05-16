import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { CookieExtractor } from './cookie-extractor.helper';

import { IPayloadToken } from '../interfaces/payloadToken.interface';
import { authConfig } from '../../../config';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @Inject(authConfig.KEY) authConfiguration: ConfigType<typeof authConfig>,
    private readonly cookieExtractor: CookieExtractor,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        cookieExtractor.extractAccessToken,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: authConfiguration.jwtAccessSecret,
    });
  }

  public async validate(payload: IPayloadToken) {
    if (payload === null) {
      throw new UnauthorizedException();
    }
    return payload;
  }
}
