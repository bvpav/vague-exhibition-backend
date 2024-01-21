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
import { ImageModule } from '../../image/image.module';
import { AppConfigModule } from '../../app-config/app-config.module';
import { ImageAccessService } from '../../image/image-access.service';

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
  const DUMMY_CATEGORIES = [
    {
      id: 2,
      slug: 'dummy-2',
      name: 'Dummy Category 2',
      projects: [],
      thumbnail: {
        id: 2,
        key: 'dummy-2',
        width: 1920,
        height: 1080,
      },
    },
    DUMMY_CATEGORY,
  ];

  let service: CategoryService;
  let mapper: Mapper;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AutomapperModule, AppConfigModule],
      providers: [
        CategoryService,
        {
          provide: ImageAccessService,
          useValue: {
            getPublicUrl: jest.fn((key) => `https://example.com/${key}`),
          },
        },
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
            save: jest.fn(),
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

    it('should contain a thumbnail', async () => {
      const dtos = await service.findAll();
      expect(dtos.every((dto) => dto.thumbnail)).toBe(true);
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

    it('should contain a thumbnail', async () => {
      const dto = await service.findBySlug(DUMMY_CATEGORY.slug);
      expect(dto.thumbnail).toBeDefined();
    });
  });

  describe('createCategory', () => {
    it('should call the repository', async () => {
      const createCategoryDto = {
        thumbnailId: 1,
        name: 'Dummy Category',
        slug: 'dummy-category',
      };
      await service.createCategory(createCategoryDto);
      expect((service as any).categoryRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          name: createCategoryDto.name,
          slug: createCategoryDto.slug,
          thumbnail: expect.objectContaining({
            id: createCategoryDto.thumbnailId,
          }),
        }),
      );
    });
  });
});
