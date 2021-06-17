import { Field, ObjectType } from '@nestjs/graphql';
import { generateGroupAggType } from '../aggregations/aggregations.dto';

export const EntityObjectType = () => {
  return (entity) => {
    // To avoid n+1 I have to create a field inside a model
    const groupAggType = generateGroupAggType(entity);
    entity.prototype['groupAgg'] = Field(() => [groupAggType], {
      nullable: true,
    })(entity.prototype, 'groupAgg');

    return ObjectType()(entity);
  };
};
