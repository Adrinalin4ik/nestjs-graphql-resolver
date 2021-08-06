import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subcompetency } from './sub-competency.entity';
import { SubcompetencyResolver } from './sub-competency.resolver';
import { SubCompetencyService } from './sub-competency.service';

@Module({
  imports: [TypeOrmModule.forFeature([Subcompetency])],
  providers: [SubCompetencyService, SubcompetencyResolver],
  controllers: [],
})
export class SubCompetencyModule {}
