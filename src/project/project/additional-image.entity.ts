import {
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Image } from '../../image/image.entity';
import { Project } from './project.entity';

@Entity()
export class AdditionalImage {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Image, { eager: true, cascade: true })
  @JoinColumn()
  image: Image;

  @ManyToOne(() => Project, (project) => project.additionalImages)
  project: Project;
}
