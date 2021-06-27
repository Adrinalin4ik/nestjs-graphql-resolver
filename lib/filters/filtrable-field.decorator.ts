import { Args } from '@nestjs/graphql';
import { generateFilterInputType } from './filter.dto';

export const Filters = (entityName: string) => {
  const type = generateFilterInputType(entityName);
  return Args({
    name: 'where',
    nullable: true,
    type: () => type,
  });
};
