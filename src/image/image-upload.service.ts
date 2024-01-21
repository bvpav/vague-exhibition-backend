import { Injectable } from '@nestjs/common';
import { InjectS3, S3 } from 'nestjs-s3';
import { Image } from './image.entity';
import { randomUUID } from 'node:crypto';
import { ImageConstants } from './image.constants';
import { BucketAlreadyOwnedByYou } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { Readable } from 'stream';
import { AppConfigService } from '../app-config/app-config.service';

@Injectable()
export class ImageUploadService {
  constructor(
    @InjectS3() private readonly s3: S3,
    private readonly appConfigService: AppConfigService,
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

  async uploadImage(imageStream: Readable, image: Image, fileName?: string) {
    const key = fileName || randomUUID();
    const upload = new Upload({
      client: this.s3,
      params: {
        Bucket: ImageConstants.BUCKET_NAME,
        Key: key,
        Body: imageStream,
      },
    });
    await upload.done();
    image.key = key;
    return image;
  }

  getPublicUrl(key: string) {
    return `${this.appConfigService.s3PublicUrl}/${ImageConstants.BUCKET_NAME}/${key}`;
  }
}
