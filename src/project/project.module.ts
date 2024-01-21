import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdditionalImage } from './project/additional-image.entity';
import { Thumbnail } from './project/thumbnail.entity';
import { Mentor } from './people/mentor.entity';
import { ProjectKind } from './project/project-kind.entity';
import { Project } from './project/project.entity';
import { Category } from './category/category.entity';
import { Class } from './people/class.entity';
import { Student } from './people/student.entity';
import { CategoryService } from './category/category.service';
import { CategoryProfile } from './category/profile/category.profile';
import { CategoryController } from './category/category.controller';
import { CategoryCommand } from './category/profile/category.command';
import { ImageModule } from '../image/image.module';

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
    ImageModule,
  ],
  providers: [CategoryService, CategoryProfile, CategoryCommand],
  controllers: [CategoryController],
})
export class ProjectModule {}
