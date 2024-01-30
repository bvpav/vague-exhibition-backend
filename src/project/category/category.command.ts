import { Injectable, Logger } from '@nestjs/common';
import { Command } from 'nestjs-command';
import { PassThrough } from 'node:stream';
import * as https from 'node:https';
import { CategoryService } from './category.service';
import { ImageService } from '../../image/image.service';
import { ImageDownloadService } from '../../image/image-download.service';

@Injectable()
export class CategoryCommand {
  private readonly logger = new Logger(CategoryCommand.name);

  constructor(
    private readonly categoryService: CategoryService,
    private readonly imageService: ImageService,
  ) {}

  @Command({
    command: 'category:seed',
    describe: 'seed categories',
  })
  async seed() {
    const CATEGORIES = [
      {
        slug: 'software',
        name: 'Софтуер',
        thumbnailUrl: 'https://2020.tuesfest.bg/images/robotics.png',
      },
      {
        slug: 'embedded',
        name: 'Роботика',
        thumbnailUrl: 'https://2020.tuesfest.bg/images/software.png',
      },
      {
        slug: 'networks',
        name: 'Компютърни мрежи',
        thumbnailUrl: 'https://2020.tuesfest.bg/images/networks.png',
      },
      {
        slug: 'battlebots',
        name: 'Battle Bots',
        thumbnailUrl: 'https://2020.tuesfest.bg/images/robotics.png',
      },
    ];

    for (const categoryData of CATEGORIES) {
      this.logger.log(`Downloading thumbnail for ${categoryData.slug}`);
      const thumbnail = await this.imageService.uploadUrl(
        categoryData.thumbnailUrl,
        categoryData.slug,
      );
      const category = await this.categoryService.createCategory({
        slug: categoryData.slug,
        name: categoryData.name,
        thumbnailId: thumbnail.id,
      });
      this.logger.log(`Created category ${category.name}`);
      console.log(`[*] Created category ${category.name}`);
    }
  }
}
