import { AutoMap } from '@automapper/classes';

export class CreateProjectDto {
  @AutoMap()
  name: string;

  @AutoMap()
  description: string;

  @AutoMap()
  demoUrl: string;

  @AutoMap()
  repositoryUrl: string;

  @AutoMap()
  creatorIds: number[];

  @AutoMap()
  thumbnailImageId: number;

  @AutoMap()
  additionalImagesImageIds: number[];

  @AutoMap()
  kindId: number;

  @AutoMap()
  categoryId: number;

  @AutoMap()
  mentorId: number;
}
