import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Image {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  key: string;

  @Column()
  width: number;
  @Column()
  height: number;
}
