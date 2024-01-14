import { Injectable } from '@nestjs/common';
import { S3ModuleOptions, S3ModuleOptionsFactory } from 'nestjs-s3';
import { AppConfigService } from '../app-config/app-config.service';

@Injectable()
export class S3ConfigService implements S3ModuleOptionsFactory {
  constructor(private appConfigService: AppConfigService) {}

  createS3ModuleOptions(): S3ModuleOptions {
    return {
      config: {
        credentials: {
          accessKeyId: this.appConfigService.s3AccessKeyId,
          secretAccessKey: this.appConfigService.s3SecretAccessKey,
        },
        region: 'us-east-1', // TODO: make this configurable
        endpoint: this.appConfigService.s3Endpoint,
        forcePathStyle: true,
        // signatureVersion: 'v4',
      },
    };
  }
}
