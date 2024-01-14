import { Injectable } from '@nestjs/common';
import { ImageUploadService } from './image-upload.service';
import { Image } from './image.entity';
import sharp from 'sharp';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Readable } from 'stream';

@Injectable()
export class ImageService {
  constructor(
    private readonly imageUploadService: ImageUploadService,
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,
  ) {}

  async initializeStorage() {
    await this.imageUploadService.initializeStorage();
  }

  async uploadImage(imageStream: Readable, filename?: string) {
    const image = new Image();
    const pipeline = imageStream.pipe(sharp()).toFormat('webp');

    const metadata = await pipeline.metadata();
    image.width = metadata.width;
    image.height = metadata.height;

    await this.imageUploadService.uploadImage(pipeline, image, filename);

    await this.imageRepository.save(image);
    return image;
  }
}
