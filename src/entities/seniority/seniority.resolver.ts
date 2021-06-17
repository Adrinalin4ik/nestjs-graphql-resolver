import { Resolver } from '@nestjs/graphql';
import { Seniority } from './seniority.entity';
import { AutoResolver } from '../../../lib';

@AutoResolver(Seniority)
@Resolver(() => Seniority)
export class SeniorityResolver {}
