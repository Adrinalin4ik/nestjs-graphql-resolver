import { Args } from '@nestjs/graphql';
import { generateHavingInputType } from './having.dto';

export const Having1 = (entity) => {
  const type = generateHavingInputType(entity);
  return Args({
    name: 'having1',
    nullable: true,
    type: () => type,
  });
};
