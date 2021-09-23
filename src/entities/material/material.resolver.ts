import { Context, Info, Parent, Query, ResolveField, Resolver} from '@nestjs/graphql';
import { getRepository } from 'typeorm';
import { AutoResolver } from '../../../lib';
import { Task } from '../task/task.entity';
import { User } from '../user/user.entity';
import { MaterialObjectType, ResultUnion} from './material.dto';
@AutoResolver(MaterialObjectType)
@Resolver(() => MaterialObjectType)
export class MaterialResolver {

  // @Query(returns => [MaterialObjectType])
  // materials(
  //   @Info() info
  // ) {
  //   return [{
  //     id: 1,
  //     title: "Test",
  //     material_type: 'user',
  //     materialable_id: 2
  //   },
  //   {
  //     id: 2,
  //     title: "Task",
  //     material_type: 'task',
  //     materialable_id: 3
  //   }]
  // }

  // @ResolveField()
  // __resolveType(value) {
  //   if (value.name) {
  //     return 'Author';
  //   }
  //   if (value.title) {
  //     return 'Book';
  //   }
  //   return null;
  // }

  // @ResolveField(() => MaterialObjectType)
  // materialable(
  //   @Parent() material: MaterialObjectType,
  //   @Context() context,
  //   @Info() info
  // ) {
    
  //   switch(material.material_type) {
  //     case 'user':
  //       return getRepository(User).findOne({id: material.materialable_id});
  //     case 'task':
  //       return getRepository(Task).findOne({id: material.materialable_id});
  //   }
  // }
}
