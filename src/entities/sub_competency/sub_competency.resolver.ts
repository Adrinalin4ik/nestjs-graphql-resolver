import { Query, Resolver } from '@nestjs/graphql';
import { Subcompetency } from './sub_competency.entity';
import { AutoResolver } from '../../../lib';

@AutoResolver(Subcompetency)
@Resolver(() => Subcompetency)
export class SubcompetencyResolver {
  @Query(() => [Subcompetency])
  async test() {
    return [];
  }
}
