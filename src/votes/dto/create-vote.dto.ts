import { IsNumber } from 'class-validator';

export class CreateVoteDto {
  @IsNumber()
  projectId!: number;
}
