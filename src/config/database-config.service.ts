import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { AppConfigService } from '../app-config/app-config.service';

@Injectable()
export class DatabaseConfigService implements TypeOrmOptionsFactory {
  constructor(private appConfigService: AppConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      url: this.appConfigService.databaseUrl,
      synchronize: false, // For demonstration purposes only, otherwise use: this.appConfigService.environment === 'development',
      autoLoadEntities: true,
    };
  }
}
