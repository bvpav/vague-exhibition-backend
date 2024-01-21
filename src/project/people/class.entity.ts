import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Student } from './student.entity';
import { AutoMap } from '@automapper/classes';

@Entity()
@Unique(['grade', 'parallel'])
export class Class {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  // TODO: add data validation
  @AutoMap()
  grade: number;

  @Column()
  // TODO: add data validation
  @AutoMap()
  parallel: string;

  @OneToMany(() => Student, (student) => student.class)
  students: Student[];
}
