import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserCompetencyService } from './user-competency.service';
import { UserCompetency } from './user-competency.entity';
import { UserCompetencyResolver } from './user-competency.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([UserCompetency])],
  providers: [
    UserCompetencyService,
    UserCompetencyResolver,
    UserCompetencyService,
  ],
  controllers: [],
})
export class UserCompetencyModule {}
