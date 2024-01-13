import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { z } from 'zod';

@Injectable()
export class TFConfigService {
  constructor(private configService: ConfigService) {
  }

  get environment(): string {
    return this.configService.get('NODE_ENV') || 'production';
  }

  get databaseUrl(): string {
    const value = this.configService.get('POSTGRES_URL');
    return z.string().url().parse(value);
  }
}
