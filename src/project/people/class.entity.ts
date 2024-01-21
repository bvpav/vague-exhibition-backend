import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Student } from './student.entity';

@Entity()
@Unique(['grade', 'parallel'])
export class Class {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  // TODO: add data validation
  grade: number;

  @Column()
  // TODO: add data validation
  parallel: string;

  @OneToMany(() => Student, (student) => student.class)
  students: Student[];
}
