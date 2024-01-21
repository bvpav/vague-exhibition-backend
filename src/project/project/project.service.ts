import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './project.entity';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  async findAll() {
    return [];
  }

  async findById(id: number) {
    return null;
  }

  async createProject(createProjectDto: {
    demoUrl: string;
    thumbnailImageId: number;
    additionalImageIds: number[];
    name: string;
    description: string;
    creatorIds: number[];
    mentorId: number;
    categoryId: number;
    kindId: number;
    repositoryUrl: string;
  }) {}
}
