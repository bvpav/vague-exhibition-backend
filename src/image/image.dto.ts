import { AutoMap } from '@automapper/classes';

export class ImageDto {
  @AutoMap()
  url: string;
  @AutoMap()
  width: number;
  @AutoMap()
  height: number;
}
