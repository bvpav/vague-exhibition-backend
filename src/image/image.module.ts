import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Image } from './image.entity';
import { ImageService } from './image.service';
import { ImageUploadService } from './image-upload.service';
import { ImageProcessingService } from './image-processing.service';
import { ImageProfile } from './image.profile';
import { AppConfigModule } from '../app-config/app-config.module';
import { ImageAccessService } from './image-access.service';
import { ImageDownloadService } from './image-download.service';

@Module({
  imports: [TypeOrmModule.forFeature([Image]), AppConfigModule],
  providers: [
    ImageService,
    ImageProcessingService,
    ImageUploadService,
    ImageProfile,
    ImageAccessService,
    ImageDownloadService,
  ],
  exports: [ImageService, ImageAccessService],
})
export class ImageModule {
  constructor() {}
}
