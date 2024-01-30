import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { CategoryService } from './category.service';

@Controller({
  path: 'categories',
  version: '2',
})
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async findAll() {
    return this.categoryService.findAll();
  }

  @Get(':slug')
  async findBySlug(@Param('slug') slug: string) {
    const category = await this.categoryService.findBySlug(slug);
    if (!category) throw new NotFoundException();
    return category;
  }
}
