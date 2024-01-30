import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { AutoMap } from '@automapper/classes';

@Entity()
export class Image {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  key: string;

  @Column()
  @AutoMap()
  width: number;
  @Column()
  @AutoMap()
  height: number;
}
