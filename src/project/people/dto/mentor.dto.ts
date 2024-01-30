import { AutoMap } from '@automapper/classes';

export class MentorDto {
  @AutoMap()
  firstName: string;

  @AutoMap()
  lastName: string;
}
