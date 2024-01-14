import { Injectable } from '@nestjs/common';
import { ImageUploadService } from './image-upload.service';
import { Image } from './image.entity';
import sharp from 'sharp';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Readable } from 'stream';
import { ImageProcessingService } from './image-processing.service';

@Injectable()
export class ImageService {
  constructor(
    private readonly imageUploadService: ImageUploadService,
    private readonly imageProcessingService: ImageProcessingService,
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,
  ) {}

  async initializeStorage() {
    await this.imageUploadService.initializeStorage();
  }

  async uploadImage(imageStream: Readable, fileName?: string) {
    const image = new Image();
    const webp = await this.imageProcessingService.toWebp(imageStream, image);
    await this.imageUploadService.uploadImage(webp, image, fileName);

    await this.imageRepository.save(image);
    return image;
  }
}
