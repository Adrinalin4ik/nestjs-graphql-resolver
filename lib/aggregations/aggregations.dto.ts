import { ObjectType, registerEnumType } from '@nestjs/graphql';
import { GqlType } from '../helpers/classes';
import { getEntityPrimitiveType } from '../dto/entity-helper.dto';
import { decorateField } from '../helpers/decorators';

export enum AggregationEnum {
  avg = 'avg',
  sum = 'sum',
  count = 'count',
  max = 'max',
  min = 'min',
}

export const AggregationValueArray = Object.values(AggregationEnum) as string[];

registerEnumType(AggregationEnum, {
  name: 'Aggregation',
});

export const EntityGroupAggType = new Map();

export const generateGroupAggType = (entity: GqlType) => {
  const primitiveEnum = getEntityPrimitiveType(entity);
  if (!EntityGroupAggType.has(entity.graphqlName)) {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    function Group() {}
    decorateField(Group, 'by', () => primitiveEnum);
    decorateField(Group, 'count', () => Number);
    decorateField(Group, 'fields', () => [entity]);

    for (const operator of Object.values(AggregationEnum)) {
      decorateField(Group, operator.toLowerCase(), () => primitiveEnum);
    }

    ObjectType()(Group);

    Object.defineProperty(Group, 'name', {
      value: `${entity.graphqlName}GroupType`,
    });
    EntityGroupAggType.set(entity.graphqlName, Group);
  }
  return EntityGroupAggType.get(entity.graphqlName);
};
