import { Int, ObjectType } from '@nestjs/graphql';
import { Field } from '../../../lib';

@ObjectType()
export class BaseDTO {
  @Field(() => Int)
  id: number;

  // Timestamps
  @Field(() => Date)
  created_at: Date;

  @Field(() => Date)
  updated_at: Date;
}
