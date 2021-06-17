import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompetencyService } from '../competency/competency.service';
import { Seniority } from './seniority.entity';
import { SeniorityResolver } from './seniority.resolver';
import { SeniorityService } from './seniority.service';

@Module({
  imports: [TypeOrmModule.forFeature([Seniority])],
  providers: [SeniorityService, SeniorityResolver, CompetencyService],
  controllers: [],
})
export class SeniorityModule {}
