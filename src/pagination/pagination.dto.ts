import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class PaginationInputType {
  @Field(() => Number)
  page: number;

  @Field(() => Number)
  per_page: number;
}
