import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdditionalImage } from './additional-image.entity';
import { Thumbnail } from './thumbnail.entity';
import { Mentor } from './mentor.entity';
import { ProjectKind } from './project-kind.entity';
import { Project } from './project.entity';
import { Category } from './category.entity';
import { Class } from './class.entity';
import { Student } from './student.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AdditionalImage,
      Category,
      Class,
      Mentor,
      Project,
      ProjectKind,
      Student,
      Thumbnail,
    ]),
  ],
})
export class ProjectModule {}
