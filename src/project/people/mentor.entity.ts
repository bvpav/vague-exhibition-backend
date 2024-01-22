import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Project } from '../project/project.entity';
import { AutoMap } from '@automapper/classes';

@Entity()
export class Mentor {
  @PrimaryGeneratedColumn()
  @AutoMap()
  id: number;

  @Column()
  @AutoMap()
  firstName: string;
  @Column()
  @AutoMap()
  lastName: string;

  @OneToMany(() => Project, (project) => project.mentor)
  projects: Project[];
}
