import { Field, Int } from "@nestjs/graphql";
import { EntityObjectType } from "../../../lib";
import { CompetencyObjectType } from "../competency/competency.dto";
import { SubcompetencyObjectType } from "../sub-competency/sub-competency.dto";
import { UserObjectType } from "../user/user.dto";

@EntityObjectType({
  name: 'UserSubcompetency'
})
export class UserSubcompetencyObjectType {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  public subcompetency_id: number;

  @Field(() => Int)
  public user_id: number;

  @Field(() => SubcompetencyObjectType, { nullable: true })
  subcompetency: SubcompetencyObjectType;

  @Field(() => UserObjectType, { nullable: true })
  user: UserObjectType;

  @Field(() => String)
  created_at: Date;

  @Field(() => String)
  updated_at: Date;
}
