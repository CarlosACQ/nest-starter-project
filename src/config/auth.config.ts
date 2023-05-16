import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET,
  tokenExpires: parseInt(process.env.JWT_TOKEN_EXPIRES_IN, 10),
  refreshTokenExpires: parseInt(process.env.JWT_REFRESHTOKEN_EXPIRES_IN, 10),
}));
