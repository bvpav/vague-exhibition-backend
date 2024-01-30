import { Injectable } from '@nestjs/common';
import { ImageUploadService } from './image-upload.service';
import { Image } from './image.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Readable } from 'stream';
import { ImageProcessingService } from './image-processing.service';
import { ImageDownloadService } from './image-download.service';

@Injectable()
export class ImageService {
  constructor(
    private readonly imageUploadService: ImageUploadService,
    private readonly imageProcessingService: ImageProcessingService,
    private readonly imageDownloadService: ImageDownloadService,
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,
  ) {}

  async uploadImage(imageStream: Readable, fileName?: string) {
    const image = new Image();
    const webp = await this.imageProcessingService.toWebp(imageStream, image);
    if (fileName) {
      fileName += '.webp';
    }
    await this.imageUploadService.uploadImage(webp, image, fileName);
    await this.imageRepository.save(image);
    return image;
  }

  async uploadUrl(url: string, fileName?: string) {
    const imageStream = await this.imageDownloadService.download(url);
    return this.uploadImage(imageStream, fileName);
  }
}
