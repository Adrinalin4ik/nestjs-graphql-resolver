import { Args } from '@nestjs/graphql';
import { generateSortInputType } from './sort.dto';

export const Sorting = (entity) => {
  const type = generateSortInputType(entity);
  return Args({
    name: 'sort',
    nullable: true,
    type: () => type,
  });
};
