import { AutoMap } from '@automapper/classes';

export class StudentDto {
  @AutoMap()
  firstName: string;
  @AutoMap()
  lastName: string;
  @AutoMap()
  classGrade: number;
  @AutoMap()
  classParallel: string;
}
