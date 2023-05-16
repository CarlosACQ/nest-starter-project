import { Module, Global } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { databaseConfig } from '../config';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [databaseConfig.KEY],
      useFactory: (databaseConfiguration: ConfigType<typeof databaseConfig>) => {
        const { host, port, username, password, database, dbType } = databaseConfiguration;
        return {
          type: dbType,
          host: host,
          port: +port,
          username,
          password,
          database,
          autoLoadEntities: true,
          synchronize: false,
          namingStrategy: new SnakeNamingStrategy(),
        } as DataSourceOptions;
      },
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule { }
