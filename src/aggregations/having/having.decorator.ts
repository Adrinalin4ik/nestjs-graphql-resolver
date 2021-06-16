import { Args } from '@nestjs/graphql';
import { generateHavingItemInputType } from './having.dto';

export const Having = () => {
  const type = generateHavingItemInputType();
  return Args({
    name: 'having',
    nullable: true,
    type: () => type,
  });
};
