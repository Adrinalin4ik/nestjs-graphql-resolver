import { ObjectType, registerEnumType } from '@nestjs/graphql';
import { getEntityPrimitiveType } from '../dto/entity-helper.dto';
import { decorateField } from '../helpers/decorators';

export enum AggregationEnum {
  AVG = 'avg',
  SUM = 'sum',
  COUNT = 'count',
  MAX = 'max',
  MIN = 'min',
}

export const AggregationValueArray = Object.values(AggregationEnum) as string[];

registerEnumType(AggregationEnum, {
  name: 'Aggregation',
});

export const EntityGroupAggType = new Map();

export const generateGroupAggType = (entity) => {
  const primitiveEnum = getEntityPrimitiveType(entity);
  if (!EntityGroupAggType.has(entity['name'])) {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    function Group() {}
    decorateField(Group, 'by', primitiveEnum);
    decorateField(Group, 'count', Number);
    decorateField(Group, 'fields', [entity]);

    for (const operator of Object.values(AggregationEnum)) {
      decorateField(Group, operator.toLowerCase(), primitiveEnum);
    }

    ObjectType()(Group);

    Object.defineProperty(Group, 'name', {
      value: `${entity['name']}GroupType`,
    });
    EntityGroupAggType.set(entity['name'], Group);
  }
  return EntityGroupAggType.get(entity['name']);
};
