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
import { CreateProjectDto } from '../dto/create-project.dto';
import { ProjectKind } from '../project-kind.entity';
import { Thumbnail } from '../thumbnail.entity';
import { Category } from '../../category/category.entity';

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
      createMap(
        mapper,
        CreateProjectDto,
        Project,
        // FIXME: this is a hack to make reverse unflattening work
        forMember(
          (d) => d.kind,
          mapFrom((s) => {
            const kind = new ProjectKind();
            kind.id = s.kindId;
            return kind;
          }),
        ),
        forMember(
          (d) => d.thumbnail,
          mapFrom((s) => {
            const image = new Image();
            image.id = s.thumbnailImageId;
            const thumbnail = new Thumbnail();
            thumbnail.image = image;
            return thumbnail;
          }),
        ),
        forMember(
          (d) => d.creators,
          mapFrom((s) => {
            return s.creatorIds.map((id) => {
              const student = new Student();
              student.id = id;
              return student;
            });
          }),
        ),
        forMember(
          (d) => d.category,
          mapFrom((s) => {
            const category = new Category();
            category.id = s.categoryId;
            return category;
          }),
        ),
        forMember(
          (d) => d.kind,
          mapFrom((s) => {
            const kind = new ProjectKind();
            kind.id = s.kindId;
            return kind;
          }),
        ),
        forMember(
          (d) => d.mentor,
          mapFrom((s) => {
            const mentor = new Mentor();
            mentor.id = s.mentorId;
            return mentor;
          }),
        ),
        forMember(
          (d) => d.additionalImages,
          mapFrom((s) => {
            return s.additionalImagesImageIds.map((id) => {
              const image = new Image();
              image.id = id;
              const additionalImage = new AdditionalImage();
              additionalImage.image = image;
              return additionalImage;
            });
          }),
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
