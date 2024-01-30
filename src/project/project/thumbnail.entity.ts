import { Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Image } from '../../image/image.entity';
import { Project } from './project.entity';
import { AutoMap } from '@automapper/classes';

@Entity()
export class Thumbnail {
  @PrimaryGeneratedColumn()
  @AutoMap()
  id: number;

  @OneToOne(() => Image, { eager: true, cascade: true })
  @JoinColumn()
  @AutoMap(() => Image)
  image: Image;

  @OneToOne(() => Project, (project) => project.thumbnail)
  @JoinColumn()
  project: Project;
}
