import { Resolver } from '@nestjs/graphql';
import { UserCompetency } from './user-competency.entity';
import { AutoResolver } from '../../../lib';
import { UserCompetencyObjectType } from './user-competency.dto';

@AutoResolver(UserCompetencyObjectType)
@Resolver(() => UserCompetencyObjectType)
export class UserCompetencyResolver {}
