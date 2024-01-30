import { Injectable, Logger } from '@nestjs/common';
import * as https from 'node:https';
import { PassThrough } from 'node:stream';

@Injectable()
export class ImageDownloadService {
  private readonly logger = new Logger(ImageDownloadService.name);

  async download(url: string) {
    const stream = new PassThrough();
    this.logger.debug(`Downloading url: ${url}`);
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        this.logger.error(`Failed to download ${url}`);
        throw new Error(`Failed to download ${url}`);
      }
      res.pipe(stream);
    });
    return stream;
  }
}
