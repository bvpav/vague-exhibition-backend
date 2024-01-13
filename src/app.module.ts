import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { TFConfigModule } from './tfconfig/tfconfig.module';

@Module({
  imports: [ConfigModule.forRoot(), DatabaseModule, TFConfigModule],
  controllers: [],
  providers: [],
})
export class AppModule {
}
