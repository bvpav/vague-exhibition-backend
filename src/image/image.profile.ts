import { Injectable } from '@nestjs/common';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, forMember, mapFrom, Mapper } from '@automapper/core';
import { Image } from './image.entity';
import { ImageDto } from './image.dto';

@Injectable()
export class ImageProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper) => {
      createMap(
        mapper,
        Image,
        ImageDto,
        forMember(
          (d) => d.url,
          mapFrom((s) => '...'),
        ),
      );
    };
  }
}
