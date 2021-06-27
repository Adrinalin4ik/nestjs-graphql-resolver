import { Field, GraphQLISODateTime, Int } from "@nestjs/graphql";
import { EntityObjectType } from "../../../lib";
import { CompetencyObjectType } from "../competency/competency.dto";

@EntityObjectType({
  name: 'Subcompetency'
})
export class SubcompetencyObjectType {
  @Field(() => Int)
  id: number;

  @Field()
  title: string;

  @Field(() => Int)
  public competency_id: number;

  @Field(() => CompetencyObjectType, { nullable: true })
  competency: CompetencyObjectType;

  @Field(() => [CompetencyObjectType], { nullable: true })
  user_subcompetencies: CompetencyObjectType[];
  
  @Field(() => GraphQLISODateTime, { nullable: true })
  date_time_with_timezone: Date;

  @Field(() => GraphQLISODateTime)
  created_at: Date;

  @Field(() => GraphQLISODateTime)
  updated_at: Date;

  @Field(() => Boolean)
  test_bool: boolean;
}