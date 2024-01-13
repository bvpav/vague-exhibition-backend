import { Module } from '@nestjs/common';
import { TFConfigService } from './tfconfig.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  providers: [TFConfigService],
  imports: [ConfigModule],
  exports: [TFConfigService],
})
export class TFConfigModule {
}
