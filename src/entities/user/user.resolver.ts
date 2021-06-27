import { Resolver } from '@nestjs/graphql';
import { User } from './user.entity';
import { AutoResolver } from '../../../lib';
import { UserObjectType } from './user.dto';

@AutoResolver(UserObjectType)
@Resolver(() => UserObjectType)
export class UserResolver {}
