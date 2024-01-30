import { Injectable } from '@nestjs/common';
import { ProjectService } from './project.service';
import { Command } from 'nestjs-command';
import { z } from 'zod';
import { CreateProjectDto } from './dto/create-project.dto';
import { CategoryService } from '../category/category.service';
import { ImageService } from '../../image/image.service';
import { slugify } from 'transliteration';
import { PeopleService } from '../people/people.service';

@Injectable()
export class ProjectCommand {
  constructor(
    private readonly projectService: ProjectService,
    private readonly categoryService: CategoryService,
    private readonly imageService: ImageService,
    private readonly peopleService: PeopleService,
  ) {}

  private static readonly projectListSchema = z.array(
    z.object({
      id: z.number(),
      name: z.string(),
      thumbnail: z.string(),
      video: z.string(),
      category: z.string(),
    }),
  );

  private static readonly projectDetailsSchema = z.object({
    id: z.number(),
    name: z.string(),
    description: z.string(),
    video: z.string(),
    type: z.string(),
    category: z.string(),
    mentor: z.string(),
    has_thumbnail: z.boolean(),
    links: z.object({ github: z.string(), demo: z.string() }),
    creators: z.array(z.object({ name: z.string(), class: z.string() })),
    pictures: z.array(z.object({ url: z.string(), is_thumbnail: z.boolean() })),
    next_id: z.number(),
    prev_id: z.number(),
  });

  private static readonly KIND_MAPPING = {
    extra: 'Извънкласна дейност',
    class: 'Курсов проект',
    diploma: 'Дипломна работа',
  };

  @Command({
    command: 'project:import',
    describe: 'import projects from website',
  })
  async import() {
    const projects = await this.fetchProjectList();
    for (const project of projects) {
      await this.importProject(project);
    }
  }

  private async importProject(
    rootProject: z.infer<typeof ProjectCommand.projectListSchema>[number],
  ) {
    if (rootProject.id === 319 || rootProject.id == 376) {
      // FIXME: these projects are broken
      // 319: image not found
      // 376: Васил е прекалено голям лидер
      return;
    }

    const project = await this.fetchProject(rootProject.id);

    const createProjectDto = new CreateProjectDto();
    createProjectDto.name = project.name;
    createProjectDto.description = project.description;
    createProjectDto.demoUrl = project.links.demo;
    createProjectDto.repositoryUrl = project.links.github;

    createProjectDto.creatorIds = [];
    for (const creator of project.creators) {
      const student = await this.getOrCreateStudent(creator);
      createProjectDto.creatorIds.push(student.id);
    }

    const projectSlug = slugify(project.name);

    const baseUrl = new URL('https://2023.tuesfest.bg');

    const uploadPromises = await Promise.allSettled(
      project.pictures
        .filter((picture) => !picture.is_thumbnail)
        .map(async (picture, i) => {
          const image = await this.imageService.uploadUrl(
            new URL(picture.url, baseUrl).toString(),
            `${projectSlug}/image_${i.toString().padStart(2, '0')}`,
          );
          return image.id;
        }),
    );
    createProjectDto.additionalImagesImageIds = uploadPromises
      .filter(
        (promise): promise is PromiseFulfilledResult<number> =>
          promise.status === 'fulfilled',
      )
      .map((promise) => promise.value);

    const thumbnail = project.pictures.find((picture) => picture.is_thumbnail);
    if (thumbnail) {
      const image = await this.imageService.uploadUrl(
        new URL(thumbnail.url, baseUrl).toString(),
        `${projectSlug}/thumbnail`,
      );
      createProjectDto.thumbnailImageId = image.id;
    } else {
      createProjectDto.thumbnailImageId =
        createProjectDto.additionalImagesImageIds[0];
      if (!createProjectDto.thumbnailImageId) {
        throw new Error(
          `Project ${project.name} has no thumbnail and no additional images`,
        );
      }
    }

    const projectKind = await this.getOrCreateProjectKind(project.type);
    createProjectDto.kindId = projectKind.id;

    const category = await this.getCategory(project.category);
    // FIXME: we need the ID here, so we had to modify the DTO, which should not contain the ID field otherwise
    createProjectDto.categoryId = category.id;

    if (project.mentor.length > 0) {
      const mentor = await this.getOrCreateMentor(project.mentor);
      createProjectDto.mentorId = mentor.id;
    } else {
      createProjectDto.mentorId = null;
    }

    await this.projectService.createProject(createProjectDto);
    console.log(`[*] Created project ${project.name}`);
  }

  private async getOrCreateStudent(creator: { name?: string; class?: string }) {
    const [firstName, lastName] = creator.name.split(' ');
    // Parse "9А" or "12В" into grade and parallel
    const classGrade = parseInt(creator.class);
    const classParallel = creator.class[creator.class.length - 1];
    const student = await this.peopleService.findStudentByNameAndClass(
      firstName,
      lastName,
      classGrade,
      classParallel,
    );
    if (student) {
      return student;
    }
    return this.peopleService.createStudent(
      firstName,
      lastName,
      classGrade,
      classParallel,
    );
  }

  private async fetchProject(id: number) {
    return await fetch(`https://2023.tuesfest.bg/data/project/${id}.json`)
      .then((res) => res.json())
      .then((res) => ProjectCommand.projectDetailsSchema.parse(res));
  }

  private async fetchProjectList() {
    return await fetch('https://2023.tuesfest.bg/data/projects.json')
      .then((res) => res.json())
      .then((res) => ProjectCommand.projectListSchema.parse(res));
  }

  private async getCategory(slug: string) {
    if (slug === 'battlebot') {
      slug = 'battlebots';
    }
    const categoryDto = await this.categoryService.findBySlug(slug);
    if (!categoryDto) {
      throw new Error(
        `Category with slug ${slug} not found. Run category:seed first`,
      );
    }
    return categoryDto;
  }

  private async getOrCreateProjectKind(kindName: string) {
    if (Object.hasOwnProperty.call(ProjectCommand.KIND_MAPPING, kindName)) {
      kindName = ProjectCommand.KIND_MAPPING[kindName];
    }
    const kind = await this.projectService.findKindByName(kindName);
    if (kind) {
      return kind;
    }
    return this.projectService.createKind(kindName);
  }

  private async getOrCreateMentor(fullName: string) {
    const [firstName, lastName] = fullName.split(' ');
    const mentor = await this.peopleService.findMentorByName(
      firstName,
      lastName,
    );
    if (mentor) {
      return mentor;
    }
    return this.peopleService.createMentor(firstName, lastName);
  }
}
