import { createUnionType, Field, Int } from '@nestjs/graphql';
import { EntityObjectType, PolymorphicRelation } from '../../../lib';
import { TaskObjectType } from '../task/task.dto';
import { Task } from '../task/task.entity';
import { UserCompetencyObjectType } from '../user-competency/user-competency.dto';
import { UserCompetency } from '../user-competency/user-competency.entity';
import { UserObjectType } from '../user/user.dto';
import { User } from '../user/user.entity';

export const ResultUnion = createUnionType({
  name: 'ResultUnion',
  types: () => [UserObjectType, TaskObjectType, UserCompetencyObjectType],
  resolveType(value) {
    if (value instanceof User) {
      return UserObjectType
    } else if (value instanceof UserCompetency) {
      return UserCompetencyObjectType
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
    typePropertyName: 'material_type'
  })
  @Field(() => ResultUnion, {nullable: true})
  public materialabl: User | Task | UserCompetency;
}