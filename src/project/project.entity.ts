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
import { Student } from './student.entity';
import { Category } from './category.entity';
import { ProjectKind } from './project-kind.entity';
import { Mentor } from './mentor.entity';

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;
  @Column()
  description: string;
  @Column()
  demoUrl: string;
  @Column()
  repositoryUrl: string;

  @OneToOne(() => Thumbnail, (thumbnail) => thumbnail.project, { eager: true })
  thumbnail: Thumbnail;

  @OneToMany(
    () => AdditionalImage,
    (additionalImage) => additionalImage.project,
    {
      eager: true,
    },
  )
  additionalImages: AdditionalImage[];

  @ManyToMany(() => Student, (student) => student.projects, { eager: true })
  @JoinTable()
  creators: Student[];

  @ManyToOne(() => Category, (category) => category.projects, { eager: true })
  category: Category;

  @ManyToOne(() => ProjectKind, (kind) => kind.projects, { eager: true })
  kind: ProjectKind;

  @ManyToOne(() => Mentor, (mentor) => mentor.projects, { eager: true })
  mentor: Mentor;
}
