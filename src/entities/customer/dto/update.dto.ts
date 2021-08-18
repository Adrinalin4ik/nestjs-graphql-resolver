import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateCustomerDTO {
  @Field()
  id: number;

  @Field()
  name: string;
}
