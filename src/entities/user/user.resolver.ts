import { Resolver } from '@nestjs/graphql';
import { User } from './user.entity';
import { AutoResolver } from '../../../lib';

@AutoResolver(User)
@Resolver(() => User)
export class UserResolver {}
