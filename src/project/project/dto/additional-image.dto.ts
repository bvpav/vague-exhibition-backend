import { AutoMap } from '@automapper/classes';
import { ImageDto } from '../../../image/image.dto';

export class AdditionalImageDto {
  @AutoMap(() => ImageDto)
  image: ImageDto;
}
