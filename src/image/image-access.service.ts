import { Injectable } from '@nestjs/common';
import { ImageConstants } from './image.constants';
import { AppConfigService } from '../app-config/app-config.service';

@Injectable()
export class ImageAccessService {
  constructor(private readonly appConfigService: AppConfigService) {}

  getPublicUrl(key: string) {
    return `${this.appConfigService.s3PublicUrl}/${ImageConstants.BUCKET_NAME}/${key}`;
  }
}
