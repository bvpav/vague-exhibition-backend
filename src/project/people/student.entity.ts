import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Project } from '../project/project.entity';
import { Class } from './class.entity';
import { AutoMap } from '@automapper/classes';

@Entity()
export class Student {
  @PrimaryGeneratedColumn()
  @AutoMap()
  id: number;

  @Column()
  @AutoMap()
  firstName: string;

  @Column()
  @AutoMap()
  lastName: string;

  @ManyToOne(() => Class, (class_) => class_.students, { eager: true })
  @AutoMap()
  class: Class;

  @ManyToMany(() => Project, (project) => project.creators)
  projects: Project[];
}
