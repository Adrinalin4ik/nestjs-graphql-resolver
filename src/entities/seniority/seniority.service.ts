import { Injectable } from '@nestjs/common';
import { Seniority } from './seniority.entity';
import { getRepository } from 'typeorm';

@Injectable()
export class SeniorityService {
  async findAll(): Promise<Seniority[]> {
    return getRepository(Seniority).find();
  }

  async findOne(id: number): Promise<Seniority> {
    return getRepository(Seniority).findOne(id);
  }
}
