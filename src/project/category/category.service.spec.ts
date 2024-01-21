import { Test, TestingModule } from '@nestjs/testing';
import { CategoryService } from './category.service';
import { Repository } from 'typeorm';
import { Category } from './category.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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
      ],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of categories', async () => {
      expect(await service.findAll()).toBe(DUMMY_CATEGORIES);
    });
  });

  describe('findBySlug', () => {
    it('should return a category if found', async () => {
      expect(await service.findBySlug(DUMMY_CATEGORY.slug)).toBe(
        DUMMY_CATEGORY,
      );
    });

    it('should return null if not found', async () => {
      expect(await service.findBySlug('not-found')).toBeNull();
    });
  });
});