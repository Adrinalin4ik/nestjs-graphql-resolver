import { Resolver } from '@nestjs/graphql';
import { UserSubcompetency } from './user-subcompetency.entity';
import { AutoResolver } from '../../../lib';
import { UserSubcompetencyObjectType } from './user-subcompetency.dto';

@AutoResolver(UserSubcompetencyObjectType)
@Resolver(() => UserSubcompetencyObjectType)
export class UserSubcompetencyResolver {}
