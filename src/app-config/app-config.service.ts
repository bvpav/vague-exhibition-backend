import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { z } from 'zod';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  get environment() {
    return this.configService.get('NODE_ENV') || 'production';
  }

  get databaseUrl() {
    const value = this.configService.get('POSTGRES_URL');
    return z.string().url().parse(value);
  }

  get s3AccessKeyId() {
    const value = this.configService.get('S3_ACCESS_KEY_ID');
    return z.string().trim().min(1).parse(value);
  }

  get s3SecretAccessKey() {
    const value = this.configService.get('S3_SECRET_ACCESS_KEY');
    return z.string().min(1).parse(value);
  }

  get s3Endpoint() {
    const value = this.configService.get('S3_ENDPOINT');
    return z.string().url().parse(value);
  }
}
