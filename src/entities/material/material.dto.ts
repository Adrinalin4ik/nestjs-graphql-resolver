import { createUnionType, Field, Int } from '@nestjs/graphql';
import { EntityObjectType, PolymorphicRelation } from '../../../lib';
import { TaskObjectType } from '../task/task.dto';
import { Task } from '../task/task.entity';
import { UserObjectType } from '../user/user.dto';
import { User } from '../user/user.entity';

export const ResultUnion = createUnionType({
  name: 'ResultUnion',
  types: () => [UserObjectType, TaskObjectType],
  resolveType(value) {
    if (value instanceof User) {
      return UserObjectType
    } else {
      return TaskObjectType
    }
    
  },
});

@EntityObjectType({
  name: 'Material'
})
export class MaterialObjectType {
  @Field(() => Int)
  id: number;

  @Field()
  title: string;

  @Field(() => Int)
  public materialable_id: number;

  @Field(() => String)
  public material_type: string;

  @PolymorphicRelation({
    idPropertyName: 'materialable_id', 
    typePropertyName: 'material_type', 
    resolveType: (type) => {
      switch (type) {
        case 'User':
          return User
        case 'Task':
          return Task
      }
    }
  })
  @Field(() => ResultUnion, {nullable: true})
  public materialable: User | Task;
}