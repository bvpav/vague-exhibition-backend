import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Project } from './project.entity';
import { AutoMap } from '@automapper/classes';

@Entity()
export class ProjectKind {
  @PrimaryGeneratedColumn()
  @AutoMap()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Project, (project) => project.kind)
  projects: Project[];
}
