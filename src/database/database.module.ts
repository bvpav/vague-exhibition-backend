import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TFConfigModule } from '../tfconfig/tfconfig.module';
import { TFConfigService } from '../tfconfig/tfconfig.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [TFConfigModule],
      inject: [TFConfigService],
      useFactory(tfConfigService: TFConfigService) {
        return {
          type: 'postgres',
          url: tfConfigService.databaseUrl,
          entities: [],
          synchronize: tfConfigService.environment === 'development',
        };
      },
    }),
  ],
})
export class DatabaseModule {
}
