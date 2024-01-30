import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AdditionalImage } from './additional-image.entity';
import { Thumbnail } from './thumbnail.entity';
import { Student } from '../people/student.entity';
import { Category } from '../category/category.entity';
import { ProjectKind } from './project-kind.entity';
import { Mentor } from '../people/mentor.entity';
import { AutoMap } from '@automapper/classes';

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  @AutoMap()
  id: number;

  @Column({ unique: true })
  @AutoMap()
  name: string;
  @Column()
  @AutoMap()
  description: string;
  @Column()
  @AutoMap()
  demoUrl: string;
  @Column()
  @AutoMap()
  repositoryUrl: string;

  @OneToOne(() => Thumbnail, (thumbnail) => thumbnail.project, { eager: true })
  @AutoMap(() => Thumbnail)
  thumbnail: Thumbnail;

  @OneToMany(
    () => AdditionalImage,
    (additionalImage) => additionalImage.project,
    {
      eager: true,
    },
  )
  @AutoMap(() => AdditionalImage)
  additionalImages: AdditionalImage[];

  @ManyToMany(() => Student, (student) => student.projects, { eager: true })
  @JoinTable()
  @AutoMap(() => Student)
  creators: Student[];

  @ManyToOne(() => Category, (category) => category.projects, { eager: true })
  @AutoMap(() => Category)
  category: Category;

  @ManyToOne(() => ProjectKind, (kind) => kind.projects, { eager: true })
  @AutoMap(() => ProjectKind)
  kind: ProjectKind;

  @ManyToOne(() => Mentor, (mentor) => mentor.projects, { eager: true })
  @AutoMap(() => Mentor)
  mentor: Mentor;
}
