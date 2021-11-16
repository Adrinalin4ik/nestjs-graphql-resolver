import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { CompetencyModule } from './entities/competency/competency.module';
import { CustomerModule } from './entities/customer/customer.module';
import { MaterialModule } from './entities/material/material.module';
import { SeniorityModule } from './entities/seniority/seniority.module';
import { SubCompetencyModule } from './entities/sub-competency/sub-competency.module';
import { TaskCommentModule } from './entities/task-comment/task-comment.module';
import { TaskModule } from './entities/task/task.module';
import { UserCompetencyModule } from './entities/user-competency/user-competency.module';
import { UserSubcompetencyModule } from './entities/user-subcompetency/user-subcompetency.module';
import { UserModule } from './entities/user/user.module';
import GraphqlModule from './graphql/graphql.module';

@Module({
  imports: [
    DatabaseModule,
    SeniorityModule,
    CompetencyModule,
    SubCompetencyModule,
    UserModule,
    UserCompetencyModule,
    UserSubcompetencyModule,
    TaskModule,
    CustomerModule,
    MaterialModule,
    TaskCommentModule,
    GraphqlModule,
  ],
})
export class AppModule {}
