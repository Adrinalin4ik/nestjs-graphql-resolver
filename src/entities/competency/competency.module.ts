import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Competency } from './competency.entity';
import { CompetencyResolver } from './competency.resolver';
import { CompetencyService } from './competency.service';

@Module({
  imports: [TypeOrmModule.forFeature([Competency])],
  providers: [CompetencyService, CompetencyResolver],
  controllers: [],
})
export class CompetencyModule {}
