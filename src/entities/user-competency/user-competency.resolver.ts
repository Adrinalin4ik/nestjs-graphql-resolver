import { Resolver } from '@nestjs/graphql';
import { UserCompetency } from './user-competency.entity';
import { AutoResolver } from '../../../lib';

@AutoResolver(UserCompetency)
@Resolver(() => UserCompetency)
export class UserCompetencyResolver {}
