import {
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Image } from '../../image/image.entity';
import { Project } from './project.entity';
import { AutoMap } from '@automapper/classes';

@Entity()
export class AdditionalImage {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Image, { eager: true, cascade: true })
  @JoinColumn()
  @AutoMap()
  image: Image;

  @ManyToOne(() => Project, (project) => project.additionalImages)
  project: Project;
}
