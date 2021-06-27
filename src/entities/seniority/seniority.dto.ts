import { Field, Int } from "@nestjs/graphql";
import { EntityObjectType } from "../../../lib";
import { CompetencyObjectType } from "../competency/competency.dto";
import { UserObjectType } from "../user/user.dto";

@EntityObjectType({
  name: 'Seniority'
})
export class SeniorityObjectType {
  @Field(() => Int)
  id: number;

  @Field()
  title: string;

  @Field(() => [CompetencyObjectType], { nullable: true })
  competencies: CompetencyObjectType[];

  @Field(() => [UserObjectType], { nullable: true })
  users: UserObjectType[];
}
