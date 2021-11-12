import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class PaginationInputType {
  @Field(() => Int)
  page: number;

  @Field(() => Int)
  per_page: number;
}
