import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subcompetency } from './sub_competency.entity';
import { SubcompetencyResolver } from './sub_competency.resolver';
import { SubCompetencyService } from './sub_competency.service';

@Module({
  imports: [TypeOrmModule.forFeature([Subcompetency])],
  providers: [SubCompetencyService, SubcompetencyResolver],
  controllers: [],
})
export class SubCompetencyModule {}
