import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Project } from '../project/project.entity';
import { Image } from '../../image/image.entity';
import { AutoMap } from '@automapper/classes';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  @AutoMap()
  slug: string;

  @Column()
  @AutoMap()
  name: string;

  @OneToMany(() => Project, (project) => project.category)
  projects: Project[];

  @OneToOne(() => Image)
  @JoinColumn()
  @AutoMap()
  thumbnail: Image;
}
