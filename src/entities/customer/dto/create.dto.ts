import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateCustomerDTO {
  @Field()
  name: string;
}
