import { Args } from '@nestjs/graphql';
import { generateOrderInputType } from './order.dto';

export const Order = (entityName) => {
  const type = generateOrderInputType(entityName);
  return Args({
    name: 'order_by',
    nullable: true,
    type: () => type,
  });
};
