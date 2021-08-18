import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class BaseDTO {
  @Field(() => Int)
  id: number;

  // Timestamps
  @Field(() => String)
  created_at: Date;

  @Field(() => String)
  updated_at: Date;
}
