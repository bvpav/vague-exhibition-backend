import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateVoteDto } from './dto/create-vote.dto';
import { UpdateVoteDto } from './dto/update-vote.dto';
import { Vote } from './entities/vote.entity';
import { QueryFailedError, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from '../project/project/project.entity';

@Injectable()
export class VotesService {
  constructor(
    @InjectRepository(Vote) private readonly voteRepository: Repository<Vote>,
  ) {}

  async create(createVoteDto: CreateVoteDto) {
    const vote = new Vote();
    vote.project = new Project();
    vote.project.id = createVoteDto.projectId;
    try {
      console.log('vote', vote);
      return await this.voteRepository.save(vote);
    } catch (e) {
      console.log('e', e);
      if (e.message.includes('violates not-null constraint')) {
        throw new NotFoundException(`Project #${vote.project.id} not found`);
      }
      throw e;
    }
  }

  findAll() {
    return this.voteRepository.find();
  }

  async findOne(id: number) {
    const vote = await this.voteRepository.findOneBy({ id });
    if (!vote) {
      throw new NotFoundException(`Vote #${id} not found`);
    }
    return vote;
  }

  async update(id: number, updateVoteDto: UpdateVoteDto) {
    const vote = await this.voteRepository.findOneBy({ id });
    if (!vote) {
      throw new NotFoundException(`Vote #${id} not found`);
    }
    vote.project = new Project();
    vote.project.id = updateVoteDto.projectId;
    try {
      return await this.voteRepository.save(vote);
    } catch (e) {
      if (e.message.includes('violates not-null constraint')) {
        throw new NotFoundException(`Project #${vote.project.id} not found`);
      }
      throw e;
    }
  }

  remove(id: number) {
    return this.voteRepository.delete({ id });
  }
}
