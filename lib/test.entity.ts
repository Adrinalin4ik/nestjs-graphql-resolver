import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class Roster {
  @Field()
  test: string;
}
