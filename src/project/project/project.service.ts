import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './project.entity';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { ProjectDto } from './dto/project.dto';
import { CreateProjectDto } from './dto/create-project.dto';

@Injectable()
export class ProjectService {
  constructor(
    @InjectMapper()
    private readonly mapper: Mapper,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
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
}
