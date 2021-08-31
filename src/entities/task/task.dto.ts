import { Field, Int } from '@nestjs/graphql';
import { EntityObjectType, JoinColumnField } from '../../../lib';
import { UserObjectType } from '../user/user.dto';
import { User } from '../user/user.entity';
import { Task } from './task.entity';

@EntityObjectType({
  name: 'Task',
})
export class TaskObjectType {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  title: string;

  @Field(() => Int)
  type_id: number;

  @Field(() => Int)
  priority: number;

  @Field(() => Int)
  story_points: number;

  @Field(() => Int)
  status: number;
  
  @Field(() => Int, { nullable: true })
  assignee_id: number;

  @JoinColumnField(Task, User, 'assignee_id')
  @Field(() => UserObjectType, { nullable: true })
  assignee: UserObjectType;

  @Field(() => Int, { nullable: true })
  task_id: number;

  @Field(() => String)
  created_at: Date;

  @Field(() => String)
  updated_at: Date;

  @Field(() => TaskObjectType, { nullable: true })
  task: TaskObjectType;

  @JoinColumnField(Task, Task, 'task_id')
  @Field(() => [TaskObjectType], { nullable: true })
  subtasks: TaskObjectType[];
}
