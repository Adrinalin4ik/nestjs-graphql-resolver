import { Field, Int } from "@nestjs/graphql";
import { EntityObjectType, JoinColumnField } from "../../../lib";
import { SeniorityObjectType } from "../seniority/seniority.dto";
import { TaskObjectType } from "../task/task.dto";
import { Task } from "../task/task.entity";
import { UserCompetencyObjectType } from "../user-competency/user-competency.dto";
import { UserSubcompetencyObjectType } from "../user-subcompetency/user-subcompetency.dto";
import { BaseDTO } from "../utils/base.dto";
import { User } from "./user.entity";

@EntityObjectType({
  name: 'User'
})
export class UserObjectType extends BaseDTO {
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

  @JoinColumnField(User, Task, 'assignee_id')
  @Field(() => [TaskObjectType], { nullable: true })
  tasks: TaskObjectType[];
}