import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  dbType: process.env.DB_TYPE,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  loggin: process.env.DB_LOGGIN,
  synchronize: process.env.DB_SYNCHRONIZE === 'true',
  entities: process.env.TYPEORM_ENTITIES,
  migrations: process.env.TYPEORM_MIGRATIONS_DIR,
}));
