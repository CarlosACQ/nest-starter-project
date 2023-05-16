import { ConfigService } from '@nestjs/config';
import { Injectable, Logger } from '@nestjs/common';
import { Request } from 'express';
import { AUTH_COOKIES } from '../constant';

@Injectable()
export class CookieExtractor {
  // private readonly logger = new Logger(CookieExtractor.name);
  constructor(private configService: ConfigService) {}

  extractAccessToken(req: Request):string {
    let token: string = null;
    if (req && req.cookies) {
      token = req.cookies[AUTH_COOKIES.ACCESS_TOKEN];
    } 
    return token ? token : null;
  }

  extractRefreshToken(req: Request):string {
    let token: string = null;
    if (req && req.cookies) {
      token = req.cookies[AUTH_COOKIES.REFRESH_TOKEN];
    } 
    return token ? token : null;
  }
}
