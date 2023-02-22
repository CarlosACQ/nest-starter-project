import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { enviroments } from './enviroments';
import { databaseConfig, authConfig } from './config';
import configSchema from './config/schema.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { RolesModule } from './modules/roles/roles.module';
import { PermissionsModule } from './modules/permissions/permissions.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, authConfig],
      envFilePath: enviroments[process.env.NODE_ENV] || '.env',
      validationSchema: configSchema,
    }),
    AuthModule,
    UsersModule,
    RolesModule,
    PermissionsModule,
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
