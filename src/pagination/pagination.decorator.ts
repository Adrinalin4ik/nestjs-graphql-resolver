import { Args } from '@nestjs/graphql';
import { PaginationInputType } from './pagination.dto';

export const Paginate = () => {
  return Args({
    name: 'paginate',
    nullable: true,
    type: () => PaginationInputType,
  });
};
