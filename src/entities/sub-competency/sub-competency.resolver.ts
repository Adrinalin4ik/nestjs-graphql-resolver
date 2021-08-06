import { Query, Resolver } from '@nestjs/graphql';
import { Subcompetency } from './sub-competency.entity';
import { AutoResolver } from '../../../lib';
import { SubcompetencyObjectType } from './sub-competency.dto';

@AutoResolver(SubcompetencyObjectType)
@Resolver(() => SubcompetencyObjectType)
export class SubcompetencyResolver {
  @Query(() => [SubcompetencyObjectType])
  async test() {
    return [];
  }
}
