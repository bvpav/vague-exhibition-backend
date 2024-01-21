import { Injectable } from '@nestjs/common';
import { Category } from './category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { CategoryDto } from './dto/category.dto';

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
    return this.mapper.mapAsync(category, Category, CategoryDto);
  }
}
