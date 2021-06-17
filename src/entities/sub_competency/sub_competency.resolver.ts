import { Query, Resolver } from '@nestjs/graphql';
import { SubCompetency } from './sub_competency.entity';
import { AutoResolver } from '../../../lib';

@AutoResolver(SubCompetency)
@Resolver(() => SubCompetency)
export class SubCompetencyResolver {
  @Query(() => [SubCompetency])
  async test() {
    return [];
  }
}
