import { Field, Int } from "@nestjs/graphql";
import { EntityObjectType, Field as FieldTest } from "../../../lib";
import { CompetencyObjectType } from "../competency/competency.dto";
import { UserObjectType } from "../user/user.dto";

@EntityObjectType({
  name: 'UserCompetency'
})
export class UserCompetencyObjectType {
  @FieldTest(() => Int)
  id: number;

  @Field(() => Int)
  public competency_id: number;

  @Field(() => Int)
  public user_id: number;

  @Field(() => CompetencyObjectType, { nullable: true })
  competency: CompetencyObjectType;

  @Field(() => UserObjectType, { nullable: true })
  user: UserObjectType;

  @Field(() => String)
  created_at: Date;

  @Field(() => String)
  updated_at: Date;
}