import { Args } from '@nestjs/graphql';
import { GqlType } from '../helpers/classes';
import { ColumnOptions } from 'typeorm';
import { generateFilterInputType } from './filter.dto';
import * as pluralize from 'pluralize';

export function FilterableField(options?: ColumnOptions) {
  return function (entity, propertyName) {
    entity['filters'] = {
      [propertyName]: true,
    };
  };
}

export const Filters1 = (entityName: string) => {
  const type = generateFilterInputType(entityName);
  return Args({
    name: 'filters1',
    nullable: true,
    type: () => type,
  });
};
