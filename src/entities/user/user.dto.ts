import { Field, Int } from "@nestjs/graphql";
import { EntityObjectType } from "../../../lib";
import { CompetencyObjectType } from "../competency/competency.dto";
import { SeniorityObjectType } from "../seniority/seniority.dto";
import { UserCompetencyObjectType } from "../user-competency/user-competency.dto";
import { UserSubcompetencyObjectType } from "../user-subcompetency/user-subcompetency.dto";

@EntityObjectType({
  name: 'User'
})
export class UserObjectType {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  identification_number: number;

  @Field()
  email: string;

  @Field()
  fname: string;

  @Field()
  lname: string;

  @Field()
  mname: string;

  @Field()
  age: number;

  @Field()
  phone: string;

  @Field()
  is_active: boolean;

  @Field(() => Int)
  public seniority_id: number;

  @Field(() => SeniorityObjectType, { nullable: true })
  seniority: SeniorityObjectType;

  @Field(() => [UserCompetencyObjectType], { nullable: true })
  user_competencies: UserCompetencyObjectType[];

  @Field(() => [UserSubcompetencyObjectType], { nullable: true })
  user_subcompetencies: UserSubcompetencyObjectType[];

  // Timestamps
  @Field(() => String)
  created_at: Date;

  @Field(() => String)
  updated_at: Date;
}