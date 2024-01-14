import { Injectable } from '@nestjs/common';
import { Readable } from 'stream';
import { Image } from './image.entity';
import sharp from 'sharp';

@Injectable()
export class ImageProcessingService {
  async toWebp(imageStream: Readable, image?: Image) {
    const pipeline = imageStream.pipe(sharp()).toFormat('webp');

    if (image) {
      const metadata = await pipeline.metadata();
      image.width = metadata.width;
      image.height = metadata.height;
    }

    return pipeline as Readable;
  }
}
