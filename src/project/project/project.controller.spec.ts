import { Test, TestingModule } from '@nestjs/testing';
import { ProjectController } from './project.controller';
import { ProjectDto } from './dto/project.dto';
import { ProjectService } from './project.service';
import { NotFoundException } from '@nestjs/common';

describe('ProjectController', () => {
  const DUMMY_PROJECT = {
    name: 'Dummy Project',
    description: 'Dummy Description',
    demoUrl: 'https://example.com/demo',
    repositoryUrl: 'https://example.com/repo',
    thumbnail: {
      url: 'https://example.com/image',
      width: 1920,
      height: 1080,
    },
    additionalImages: [
      {
        image: {
          url: 'https://example.com/image2',
          width: 1920,
          height: 1080,
        },
      },
    ],
    creators: [
      {
        firstName: 'Dummy',
        lastName: 'Student',
        classGrade: 8,
        classParallel: 'А',
      },
      {
        firstName: 'Dummy',
        lastName: 'Student 2',
        classGrade: 8,
        classParallel: 'А',
      },
    ],
    category: {
      id: 2,
      slug: 'dummy',
      name: 'Dummy Category',
      thumbnail: {
        url: 'https://example.com/image',
        width: 1920,
        height: 1080,
      },
    },
    kind: 'Dummy Kind',
    mentor: {
      firstName: 'Dummy',
      lastName: 'Mentor',
    },
  } satisfies ProjectDto;
  const DUMMY_PROJECTS = [DUMMY_PROJECT];

  let controller: ProjectController;
  let projectServiceMock: jest.Mocked<
    Omit<ProjectService, 'projectRepository'>
  >;

  beforeEach(async () => {
    projectServiceMock = {
      findAll: jest.fn(),
      findById: jest.fn(),
      createProject: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectController],
      providers: [
        {
          provide: ProjectService,
          useValue: projectServiceMock,
        },
      ],
    }).compile();

    controller = module.get<ProjectController>(ProjectController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should call the ProjectService', async () => {
      await controller.findAll();
      expect(projectServiceMock.findAll).toHaveBeenCalled();
    });

    it('should return the result from the ProjectService', async () => {
      const expected = DUMMY_PROJECTS;
      projectServiceMock.findAll.mockReturnValue(Promise.resolve(expected));
      const actual = await controller.findAll();
      expect(actual).toEqual(expected);
    });
  });

  describe('findById', () => {
    it('should call the ProjectService', async () => {
      projectServiceMock.findById.mockReturnValue(
        Promise.resolve(DUMMY_PROJECT),
      );
      await controller.findById(2);
      expect(projectServiceMock.findById).toHaveBeenCalled();
    });

    it('should return the result from the ProjectService if found', async () => {
      const expected = DUMMY_PROJECT;
      projectServiceMock.findById.mockReturnValue(Promise.resolve(expected));
      const actual = await controller.findById(expected.id);
      expect(actual).toEqual(expected);
    });

    it('should throw a NotFoundException if not found', async () => {
      projectServiceMock.findById.mockReturnValue(Promise.resolve(null));
      await expect(controller.findById(2)).rejects.toThrow(NotFoundException);
    });
  });
});
