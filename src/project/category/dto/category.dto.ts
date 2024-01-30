import { AutoMap } from '@automapper/classes';
import { ImageDto } from '../../../image/image.dto';

export class CategoryDto {
  // FIXME: we don't need id in public API, but we need it in one place
  @AutoMap()
  id: number;
  @AutoMap()
  slug: string;
  @AutoMap()
  name: string;
  @AutoMap(() => ImageDto)
  thumbnail: ImageDto;
}
