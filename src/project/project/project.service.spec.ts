import { Test, TestingModule } from '@nestjs/testing';
import { ProjectService } from './project.service';
import { Project } from './project.entity';
import { createMapper, Mapper } from '@automapper/core';
import { AutomapperModule, getMapperToken } from '@automapper/nestjs';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { classes } from '@automapper/classes';
import { ProjectProfile } from './profile/project.profile';
import { ProjectDto } from './dto/project.dto';
import { ImageProfile } from '../../image/image.profile';
import { ImageAccessService } from '../../image/image-access.service';
import { CategoryProfile } from '../category/profile/category.profile';

describe('ProjectService', () => {
  const DUMMY_PROJECT = {
    id: 2,
    name: 'Dummy Project',
    description: 'Dummy Description',
    demoUrl: 'https://example.com/demo',
    repositoryUrl: 'https://example.com/repo',
    thumbnail: {
      id: 1,
      image: {
        id: 1,
        key: 'dummy',
        width: 1920,
        height: 1080,
      },
      project: undefined as unknown as Project,
    },
    additionalImages: [],
    creators: [
      {
        id: 1,
        firstName: 'Dummy',
        lastName: 'Student',
        projects: [],
        class: {
          id: 1,
          grade: 8,
          parallel: 'А',
          students: [],
        },
      },
      {
        id: 2,
        firstName: 'Dummy',
        lastName: 'Student 2',
        projects: [],
        class: {
          id: 1,
          grade: 8,
          parallel: 'А',
          students: [],
        },
      },
    ],
    category: {
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
    },
    kind: {
      id: 1,
      name: 'Dummy Kind',
      projects: [],
    },
    mentor: {
      id: 1,
      firstName: 'Dummy',
      lastName: 'Mentor',
      projects: [],
    },
  } satisfies Project;
  const DUMMY_PROJECTS = [
    {
      id: 1,
      name: 'Dummy Project 2',
      description: 'Dummy Description 2',
      demoUrl: 'https://example.com/demo2',
      repositoryUrl: 'https://example.com/repo2',
      thumbnail: {
        id: 2,
        image: {
          id: 2,
          key: 'dummy-2',
          width: 1920,
          height: 1080,
        },
        project: undefined as unknown as Project,
      },
      additionalImages: [],
      creators: [
        {
          id: 3,
          firstName: 'Dummy',
          lastName: 'Student 3',
          projects: [],
          class: {
            id: 1,
            grade: 8,
            parallel: 'А',
            students: [],
          },
        },
        {
          id: 4,
          firstName: 'Dummy',
          lastName: 'Student 4',
          projects: [],
          class: {
            id: 1,
            grade: 8,
            parallel: 'А',
            students: [],
          },
        },
      ],
      category: {
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
      kind: {
        id: 2,
        name: 'Dummy Kind 2',
        projects: [],
      },
      mentor: {
        id: 2,
        firstName: 'Dummy',
        lastName: 'Mentor 2',
        projects: [],
      },
    },
    DUMMY_PROJECT,
  ] satisfies Project[];

  let service: ProjectService;
  let mapper: Mapper;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AutomapperModule],
      providers: [
        ProjectService,
        {
          provide: ImageAccessService,
          useValue: {
            getPublicUrl: jest.fn((key) => `https://example.com/${key}`),
          },
        },
        {
          provide: getRepositoryToken(Project),
          useValue: {
            async find() {
              return DUMMY_PROJECTS;
            },
            async findOneBy(options) {
              if (Array.isArray(options)) throw new Error('not implemented');
              return (
                DUMMY_PROJECTS.find((project) =>
                  Object.entries(options).every(
                    ([key, value]) => project[key] === value,
                  ),
                ) || null
              );
            },
            save: jest.fn(),
          } satisfies Partial<Repository<Project>>,
        },
        {
          provide: getMapperToken(),
          useValue: createMapper({
            strategyInitializer: classes(),
          }),
        },
        ProjectProfile,
        ImageProfile,
        CategoryProfile,
      ],
    }).compile();

    service = module.get<ProjectService>(ProjectService);
    mapper = module.get<Mapper>(getMapperToken());
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of projects', async () => {
      const projects = await service.findAll();
      expect(projects).toEqual(
        await mapper.mapArrayAsync(DUMMY_PROJECTS, Project, ProjectDto),
      );
    });
  });

  describe('findById', () => {
    it('should return a project with the given id if found', async () => {
      const project = await service.findById(DUMMY_PROJECT.id);
      expect(project).toEqual(
        await mapper.mapAsync(DUMMY_PROJECT, Project, ProjectDto),
      );
    });

    it('should return null if no project with the given id is found', async () => {
      const project = await service.findById(0);
      expect(project).toBeNull();
    });
  });

  describe('createProject', () => {
    it('should call the repository', async () => {
      const createProjectDto = {
        name: 'Dummy Project',
        description: 'Dummy Description',
        demoUrl: 'https://example.com/demo',
        repositoryUrl: 'https://example.com/repo',
        thumbnailImageId: 1,
        additionalImagesImageIds: [4, 5],
        creatorIds: [1, 2],
        categoryId: 1,
        kindId: 1,
        mentorId: 1,
      };
      await service.createProject(createProjectDto);
      expect((service as any).projectRepository.save).toHaveBeenCalledWith({
        name: createProjectDto.name,
        description: createProjectDto.description,
        demoUrl: createProjectDto.demoUrl,
        repositoryUrl: createProjectDto.repositoryUrl,
        thumbnail: {
          image: {
            id: createProjectDto.thumbnailImageId,
          },
        },
        additionalImages: [
          {
            image: {
              id: createProjectDto.additionalImagesImageIds[0],
            },
          },
          {
            image: {
              id: createProjectDto.additionalImagesImageIds[1],
            },
          },
        ],
        creators: [
          {
            id: createProjectDto.creatorIds[0],
          },
          {
            id: createProjectDto.creatorIds[1],
          },
        ],
        category: {
          id: createProjectDto.categoryId,
        },
        kind: {
          id: createProjectDto.kindId,
        },
        mentor: {
          id: createProjectDto.mentorId,
        },
      });
    });
  });
});
