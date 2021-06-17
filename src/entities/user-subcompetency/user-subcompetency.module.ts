import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSubcompetencyService } from './user-subcompetency.service';
import { UserSubcompetency } from './user-subcompetency.entity';
import { UserSubcompetencyResolver } from './user-subcompetency.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([UserSubcompetency])],
  providers: [
    UserSubcompetencyService,
    UserSubcompetencyResolver,
    UserSubcompetencyService,
  ],
  controllers: [],
})
export class UserSubcompetencyModule {}
