import { Args } from '@nestjs/graphql';
import { GqlType } from '../helpers/classes';
import { ColumnOptions } from 'typeorm';
import { generateFilterInputType } from './filter.dto';
export function FilterableField(options?: ColumnOptions) {
  return function (entity, propertyName) {
    entity['filters'] = {
      [propertyName]: true,
    };
  };
}

export const Filters1 = (entity: GqlType) => {
  const type = generateFilterInputType(entity.graphqlName);
  return Args({
    name: 'filters1',
    nullable: true,
    type: () => type,
  });
};
