import { Resolver } from '@nestjs/graphql';
import { Seniority } from './seniority.entity';
import { AutoResolver } from '../../../lib';
import { SeniorityObjectType } from './seniority.dto';

@AutoResolver(SeniorityObjectType)
@Resolver(() => SeniorityObjectType)
export class SeniorityResolver {}
