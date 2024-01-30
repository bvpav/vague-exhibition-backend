import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Project } from '../../project/project/project.entity';

@Entity()
export class Vote {
  @PrimaryGeneratedColumn()
  id: number;

  @JoinColumn()
  @ManyToOne(() => Project, { eager: true, cascade: true })
  project: Project;
}
