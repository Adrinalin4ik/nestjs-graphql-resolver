import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubCompetency } from './sub_competency.entity';
import { SubCompetencyResolver } from './sub_competency.resolver';
import { SubCompetencyService } from './sub_competency.service';

@Module({
  imports: [TypeOrmModule.forFeature([SubCompetency])],
  providers: [SubCompetencyService, SubCompetencyResolver],
  controllers: [],
})
export class SubCompetencyModule {}
