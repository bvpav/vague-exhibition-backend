import { Module } from '@nestjs/common';
import { AppConfigService } from './app-config.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  providers: [AppConfigService],
  imports: [ConfigModule],
  exports: [AppConfigService],
})
export class AppConfigModule {
}
