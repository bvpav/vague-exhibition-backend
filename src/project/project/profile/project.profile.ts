import { Injectable } from '@nestjs/common';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import {
  CamelCaseNamingConvention,
  createMap,
  forMember,
  mapFrom,
  Mapper,
  mapWith,
  namingConventions,
} from '@automapper/core';
import { ProjectDto } from '../dto/project.dto';
import { Project } from '../project.entity';
import { Mentor } from '../../people/mentor.entity';
import { MentorDto } from '../../people/dto/mentor.dto';
import { Image } from '../../../image/image.entity';
import { ImageDto } from '../../../image/image.dto';
import { Student } from '../../people/student.entity';
import { StudentDto } from '../../people/dto/student.dto';
import { AdditionalImage } from '../additional-image.entity';
import { AdditionalImageDto } from '../dto/additional-image.dto';

@Injectable()
export class ProjectProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper) => {
      createMap(
        mapper,
        Project,
        ProjectDto,
        forMember(
          (d) => d.kind,
          mapFrom((s) => s.kind.name),
        ),
        forMember(
          (d) => d.thumbnail,
          mapWith(ImageDto, Image, (s) => s.thumbnail.image),
        ),
      );

      // FIXME: is it ok for this to be here? 😬
      createMap(mapper, Mentor, MentorDto);
      createMap(
        mapper,
        Student,
        StudentDto,
        namingConventions(new CamelCaseNamingConvention()),
      );
      createMap(mapper, AdditionalImage, AdditionalImageDto);
    };
  }
}
