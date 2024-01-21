import { Injectable } from '@nestjs/common';
import { Command } from 'nestjs-command';

@Injectable()
export class CategoryCommand {
  @Command({
    command: 'category:seed',
    describe: 'seed categories',
  })
  async seed() {
    console.log('Seed categories');
  }
}
