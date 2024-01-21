import { AutoMap } from '@automapper/classes';
import { MentorDto } from '../../people/dto/mentor.dto';
import { ImageDto } from '../../../image/image.dto';
import { CategoryDto } from '../../category/dto/category.dto';
import { StudentDto } from '../../people/dto/student.dto';
import { AdditionalImageDto } from './additional-image.dto';

export class ProjectDto {
  @AutoMap()
  id: number;

  @AutoMap()
  name: string;

  @AutoMap()
  description: string;

  @AutoMap()
  demoUrl: string;

  @AutoMap()
  repositoryUrl: string;

  @AutoMap(() => ImageDto)
  thumbnail: ImageDto;

  @AutoMap(() => [AdditionalImageDto])
  additionalImages: AdditionalImageDto[];

  @AutoMap(() => [StudentDto])
  creators: StudentDto[];

  @AutoMap(() => CategoryDto)
  category: CategoryDto;

  @AutoMap()
  kind: string;

  @AutoMap(() => MentorDto)
  mentor: MentorDto;
}
