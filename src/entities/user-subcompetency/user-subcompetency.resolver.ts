import { Resolver } from '@nestjs/graphql';
import { UserSubcompetency } from './user-subcompetency.entity';
import { AutoResolver } from '../../../lib';

@AutoResolver(UserSubcompetency)
@Resolver(() => UserSubcompetency)
export class UserSubcompetencyResolver {}
