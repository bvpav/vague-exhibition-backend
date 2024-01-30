import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { ProjectService } from './project.service';

@Controller({
  path: 'projects',
  version: '2',
})
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get()
  async findAll() {
    return await this.projectService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: number) {
    const projectDto = await this.projectService.findById(id);
    if (!projectDto) {
      throw new NotFoundException();
    }
    return projectDto;
  }
}
