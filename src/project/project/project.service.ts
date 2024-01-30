import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './project.entity';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { ProjectDto } from './dto/project.dto';
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectKind } from './project-kind.entity';

@Injectable()
export class ProjectService {
  constructor(
    @InjectMapper()
    private readonly mapper: Mapper,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(ProjectKind)
    private readonly projectKindRepository: Repository<ProjectKind>,
  ) {}

  async findAll() {
    const projects = await this.projectRepository.find();
    return await this.mapper.mapArrayAsync(projects, Project, ProjectDto);
  }

  async findById(id: number) {
    const project = await this.projectRepository.findOneBy({ id });
    return await this.mapper.mapAsync(project, Project, ProjectDto);
  }

  async createProject(createProjectDto: CreateProjectDto) {
    const project = await this.mapper.mapAsync(
      createProjectDto,
      CreateProjectDto,
      Project,
    );
    return await this.projectRepository.save(project);
  }

  async findKindByName(kindName: string) {
    return await this.projectKindRepository.findOneBy({ name: kindName });
  }

  async createKind(kindName: string) {
    const kind = new ProjectKind();
    kind.name = kindName;
    return await this.projectKindRepository.save(kind);
  }
}
