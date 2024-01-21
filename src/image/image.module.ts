import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Image } from './image.entity';
import { ImageService } from './image.service';
import { ImageUploadService } from './image-upload.service';
import { ImageProcessingService } from './image-processing.service';
import { ImageProfile } from './image.profile';

@Module({
  imports: [TypeOrmModule.forFeature([Image])],
  providers: [
    ImageService,
    ImageProcessingService,
    ImageUploadService,
    ImageProfile,
  ],
})
export class ImageModule implements OnModuleInit {
  constructor(private readonly imageUploadService: ImageUploadService) {}

  async onModuleInit() {
    await this.imageUploadService.initializeStorage();
  }
}
