import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Project } from '../project.entity';
import { Image } from '../../image/image.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  slug: string;

  @Column()
  name: string;

  @OneToMany(() => Project, (project) => project.category)
  projects: Project[];

  @OneToOne(() => Image, { nullable: true })
  @JoinColumn()
  thumbnail: Image;
}
