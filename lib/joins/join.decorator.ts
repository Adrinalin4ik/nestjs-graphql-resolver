import { Args } from '@nestjs/graphql';
import { JoinItemQuery } from './join.dto';

export const Joins = () => {
  return Args({
    name: 'joins',
    nullable: true,
    type: () => [JoinItemQuery],
  });
};
