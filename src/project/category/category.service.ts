import { Injectable } from '@nestjs/common';
import { Category } from './category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { CategoryDto } from './dto/category.dto';
import { Image } from '../../image/image.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectMapper()
    private mapper: Mapper,
  ) {}

  async findAll() {
    const categories = await this.categoryRepository.find();
    return this.mapper.mapArrayAsync(categories, Category, CategoryDto);
  }

  async findBySlug(slug: string) {
    const category = await this.categoryRepository.findOneBy({ slug });
    const categoryDto = await this.mapper.mapAsync(
      category,
      Category,
      CategoryDto,
    );
    return categoryDto;
  }

  async createCategory(createCategoryDto: {
    thumbnailId: number;
    name: string;
    slug: string;
  }) {
    const category = new Category();
    category.name = createCategoryDto.name;
    category.slug = createCategoryDto.slug;
    category.thumbnail = new Image();
    category.thumbnail.id = createCategoryDto.thumbnailId;
    return this.categoryRepository.save(category);
  }
}
