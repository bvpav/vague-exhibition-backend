import { Test, TestingModule } from '@nestjs/testing';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { NotFoundException } from '@nestjs/common';

describe('CategoryController', () => {
  const DUMMY_CATEGORY = {
    slug: 'dummy',
    name: 'Dummy',
    thumbnail: {
      url: '...',
      width: 1920,
      height: 1080,
    },
  };
  const DUMMY_CATEGORIES = [DUMMY_CATEGORY];

  let controller: CategoryController;
  let categoryServiceMock: jest.Mocked<
    Omit<CategoryService, 'categoryRepository'>
  >;

  beforeEach(async () => {
    categoryServiceMock = {
      findAll: jest.fn(),
      findBySlug: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoryController],
      providers: [
        {
          provide: CategoryService,
          useValue: categoryServiceMock,
        },
      ],
    }).compile();

    controller = module.get<CategoryController>(CategoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should call the CategoryService', async () => {
      await controller.findAll();
      expect(categoryServiceMock.findAll).toHaveBeenCalled();
    });

    it('should return the result from the CategoryService', async () => {
      const expected = DUMMY_CATEGORIES;
      categoryServiceMock.findAll.mockReturnValue(Promise.resolve(expected));
      const actual = await controller.findAll();
      expect(actual).toEqual(expected);
    });
  });

  describe('findBySlug', () => {
    it('should call the CategoryService', async () => {
      categoryServiceMock.findBySlug.mockReturnValue(
        Promise.resolve(DUMMY_CATEGORY),
      );
      await controller.findBySlug('dummy');
      expect(categoryServiceMock.findBySlug).toHaveBeenCalled();
    });

    it('should return the result from the CategoryService if found', async () => {
      const expected = DUMMY_CATEGORY;
      categoryServiceMock.findBySlug.mockReturnValue(Promise.resolve(expected));
      const actual = await controller.findBySlug(expected.slug);
      expect(actual).toEqual(expected);
    });

    it('should throw a NotFoundException if not found', async () => {
      categoryServiceMock.findBySlug.mockReturnValue(Promise.resolve(null));
      await expect(controller.findBySlug('dummy')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
