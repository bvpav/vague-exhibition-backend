import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigModule } from '../app-config/app-config.module';
import { AppConfigService } from '../app-config/app-config.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [AppConfigModule],
      inject: [AppConfigService],
      useFactory(appConfigService: AppConfigService) {
        return {
          type: 'postgres',
          url: appConfigService.databaseUrl,
          synchronize: appConfigService.environment === 'development',
          autoLoadEntities: true,
        };
      },
    }),
  ],
})
export class DatabaseModule {
}
