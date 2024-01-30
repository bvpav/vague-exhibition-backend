import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Mentor } from './mentor.entity';
import { Equal, Repository } from 'typeorm';
import { Student } from './student.entity';
import { Class } from './class.entity';

@Injectable()
export class PeopleService {
  constructor(
    @InjectRepository(Mentor)
    private readonly mentorRepository: Repository<Mentor>,
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    @InjectRepository(Class)
    private readonly classRepository: Repository<Class>,
  ) {}

  async findMentorByName(firstName: string, lastName: string) {
    return await this.mentorRepository.findOneBy({
      firstName,
      lastName,
    });
  }

  createMentor(firstName: string, lastName: string) {
    const mentor = new Mentor();
    mentor.firstName = firstName;
    mentor.lastName = lastName;
    return this.mentorRepository.save(mentor);
  }

  async findStudentByNameAndClass(
    firstName: string,
    lastName: string,
    classGrade: number,
    classParallel: string,
  ) {
    return await this.studentRepository.findOneBy({
      firstName,
      lastName,
      class: {
        grade: Equal(classGrade),
        parallel: Equal(classParallel),
      },
    });
  }

  async createStudent(
    firstName: string,
    lastName: string,
    classGrade: number,
    classParallel: string,
  ) {
    const classEntity = await this.getOrCreateClass(classGrade, classParallel);
    return this.studentRepository.save({
      firstName,
      lastName,
      class: classEntity,
    });
  }

  private async getOrCreateClass(classGrade: number, classParallel: string) {
    const existingClass = await this.classRepository.findOneBy({
      grade: classGrade,
      parallel: classParallel,
    });
    if (existingClass) {
      return existingClass;
    }
    const classEntity = new Class();
    classEntity.grade = classGrade;
    classEntity.parallel = classParallel;
    await this.classRepository.save(classEntity);
    return classEntity;
  }
}
