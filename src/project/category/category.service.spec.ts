import { Test, TestingModule } from '@nestjs/testing';
import { CategoryService } from './category.service';
import { Repository } from 'typeorm';
import { Category } from './category.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AutomapperModule, getMapperToken } from '@automapper/nestjs';
import { createMapper, Mapper } from '@automapper/core';
import { classes } from '@automapper/classes';
import { CategoryProfile } from './profile/category.profile';
import { CategoryDto } from './dto/category.dto';
import { ImageProfile } from '../../image/image.profile';

describe('CategoryService', () => {
  const DUMMY_CATEGORY = {
    id: 1,
    slug: 'dummy',
    name: 'Dummy Category',
    projects: [],
    thumbnail: {
      id: 1,
      key: 'dummy',
      width: 1920,
      height: 1080,
    },
  } satisfies Category;
  const DUMMY_CATEGORIES = [DUMMY_CATEGORY];

  let service: CategoryService;
  let mapper: Mapper;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AutomapperModule],
      providers: [
        CategoryService,
        {
          provide: getRepositoryToken(Category),
          useValue: {
            async find() {
              return DUMMY_CATEGORIES;
            },
            async findOneBy(options) {
              if (Array.isArray(options)) throw new Error('not implemented');
              return (
                DUMMY_CATEGORIES.find((category) =>
                  Object.entries(options).every(
                    ([key, value]) => category[key] === value,
                  ),
                ) || null
              );
            },
          } satisfies Partial<Repository<Category>>,
        },
        {
          provide: getMapperToken(),
          useValue: createMapper({
            strategyInitializer: classes(),
          }),
        },
        CategoryProfile,
        ImageProfile,
      ],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
    mapper = module.get<Mapper>(getMapperToken());
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of categories', async () => {
      const categoryDtos = mapper.mapArray(
        DUMMY_CATEGORIES,
        Category,
        CategoryDto,
      );
      expect(await service.findAll()).toEqual(categoryDtos);
    });
  });

  describe('findBySlug', () => {
    it('should return a category if found', async () => {
      const dto = mapper.map(DUMMY_CATEGORY, Category, CategoryDto);
      expect(await service.findBySlug(DUMMY_CATEGORY.slug)).toEqual(dto);
    });

    it('should return null if not found', async () => {
      expect(await service.findBySlug('not-found')).toBeNull();
    });
  });
});
