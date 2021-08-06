import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { SeniorityModule } from './entities/seniority/seniority.module';
import { CompetencyModule } from './entities/competency/competency.module';
import { SubCompetencyModule } from './entities/sub-competency/sub-competency.module';
import { UserModule } from './entities/user/user.module';
import { UserCompetencyModule } from './entities/user-competency/user-competency.module';
import { UserSubcompetencyModule } from './entities/user-subcompetency/user-subcompetency.module';
import GraphqlModule from './graphql/graphql.module'

@Module({
  imports: [
    DatabaseModule,
    SeniorityModule,
    CompetencyModule,
    SubCompetencyModule,
    UserModule,
    UserCompetencyModule,
    UserSubcompetencyModule,
    GraphqlModule
  ],
})
export class AppModule {}
