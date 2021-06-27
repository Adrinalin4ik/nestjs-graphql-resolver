import { Field, ObjectType, ObjectTypeOptions } from '@nestjs/graphql';
import { generateGroupAggType } from '../aggregations/aggregations.dto';
import { GqlType } from '../helpers/classes';

interface ObjectTypeOptionsExtended extends ObjectTypeOptions {
  name?: string;
  tableName?: string;
}

export const EntityObjectTypes = new Map();

export const EntityObjectType = (options?: ObjectTypeOptionsExtended) => {
  return (entity) => {
    const typeName = options?.name || entity['name'];

    Object.defineProperty(entity, 'graphqlName', {
      value: typeName,
    });

    Object.defineProperty(entity, 'tableName', {
      value: typeName,
    });

    // generateFilterInputType(typeName);
    // To avoid n+1 I have to create a field inside a model
    addGroupAggField(entity);

    const type = ObjectType(typeName, options)(entity);
    EntityObjectTypes.set(typeName, type);
    return type;
  };
};

const addGroupAggField = (entity: GqlType) => {
  const groupAggType = generateGroupAggType(entity);
  entity['prototype']['groupAgg'] = Field(() => [groupAggType], {
    nullable: true,
  })(entity['prototype'], 'groupAgg');
}