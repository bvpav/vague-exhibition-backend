import { Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Image } from '../image/image.entity';
import { Project } from './project.entity';

@Entity()
export class Thumbnail {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Image, { eager: true, cascade: true })
  @JoinColumn()
  image: Image;

  @OneToOne(() => Project, (project) => project.thumbnail)
  @JoinColumn()
  project: Project;
}
