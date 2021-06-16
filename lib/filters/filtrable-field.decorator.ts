import { Args } from '@nestjs/graphql';
import { ColumnOptions } from 'typeorm';
import { generateFilterInputType } from './filter.dto';
export function FilterableField(options?: ColumnOptions) {
  return function (entity, propertyName) {
    entity['filters'] = {
      [propertyName]: true,
    };
  };
}

export const Filters = () => {
  const type = generateFilterInputType();
  return Args({
    name: 'filters',
    nullable: true,
    type: () => type,
  });
};
