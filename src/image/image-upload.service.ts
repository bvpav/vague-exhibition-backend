import { Injectable } from '@nestjs/common';
import { InjectS3, S3 } from 'nestjs-s3';
import { InjectRepository } from '@nestjs/typeorm';
import { Image } from './image.entity';
import { Repository } from 'typeorm';
import { ReadStream } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { ImageConstants } from './image.constants';
import { BucketAlreadyOwnedByYou } from '@aws-sdk/client-s3';
import sharp from 'sharp';
import { Upload } from '@aws-sdk/lib-storage';

@Injectable()
export class ImageUploadService {
  constructor(
    @InjectS3() private readonly s3: S3,
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,
  ) {}

  async initializeStorage() {
    try {
      await this.s3.createBucket({
        Bucket: ImageConstants.BUCKET_NAME,
      });
    } catch (e) {
      if (!(e instanceof BucketAlreadyOwnedByYou)) {
        throw e;
      }
    }
    await this.s3.putBucketPolicy({
      Bucket: ImageConstants.BUCKET_NAME,
      Policy: JSON.stringify({
        Version: '2012-10-17',
        Statement: [
          {
            Sid: 'PublicReadGetObject',
            Effect: 'Allow',
            Principal: '*',
            Action: ['s3:GetObject'],
            Resource: [`arn:aws:s3:::${ImageConstants.BUCKET_NAME}/*`],
          },
        ],
      }),
    });
  }

  async uploadImage(imageStream: ReadStream) {
    const image = new Image();

    const pipeline = imageStream.pipe(sharp()).toFormat('webp');
    const metadata = await pipeline.metadata();

    const key = randomUUID();
    const upload = new Upload({
      client: this.s3,
      params: {
        Bucket: ImageConstants.BUCKET_NAME,
        Key: key,
        Body: pipeline.toFormat('webp'),
      },
    });
    await upload.done();
    image.key = key;
    image.width = metadata.width;
    image.height = metadata.height;
    await this.imageRepository.save(image);
    return image;
  }
}
