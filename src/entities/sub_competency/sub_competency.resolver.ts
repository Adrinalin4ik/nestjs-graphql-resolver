import { Query, Resolver } from '@nestjs/graphql';
import { Subcompetency } from './sub_competency.entity';
import { AutoResolver } from '../../../lib';
import { SubcompetencyObjectType } from './sub_competency.dto';

@AutoResolver(SubcompetencyObjectType)
@Resolver(() => SubcompetencyObjectType)
export class SubcompetencyResolver {
  @Query(() => [SubcompetencyObjectType])
  async test() {
    return [];
  }
}
