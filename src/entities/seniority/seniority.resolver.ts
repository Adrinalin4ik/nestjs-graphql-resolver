import { Resolver } from '@nestjs/graphql';
import { AutoResolver } from '../../../lib';
import { SeniorityObjectType } from './seniority.dto';
import { SeniorityService } from './seniority.service';

@AutoResolver(SeniorityObjectType)
@Resolver(() => SeniorityObjectType)
export class SeniorityResolver {
  constructor(private readonly srv: SeniorityService) {
    console.log('service', srv)
  }
}
