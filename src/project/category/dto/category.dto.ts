import { AutoMap } from '@automapper/classes';
import { ImageDto } from '../../../image/image.dto';

export class CategoryDto {
  @AutoMap()
  slug: string;
  @AutoMap()
  name: string;
  @AutoMap()
  thumbnail: ImageDto;
}
