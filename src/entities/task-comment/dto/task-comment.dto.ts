import { Int } from '@nestjs/graphql';
import {
  EntityObjectType, Field, JoinColumnField
} from '../../../../lib';
import { UserObjectType } from '../../user/user.dto';
import { User } from '../../user/user.entity';
import { BaseDTO } from '../../utils/base.dto';
import { TaskComment } from '../task-comment.entity';

@EntityObjectType({
  name: 'TaskComment',
  tableName: 'task_comment'
})
export class TaskCommentObjectType extends BaseDTO {
  @Field(() => Int, { nullable: false })
  task_id: number;

  @Field(() => Int, { nullable: false })
  author_id: number;

  @Field(() => String, { nullable: false })
  html_content: string;

  @JoinColumnField(TaskComment, User, 'author_id')
  @Field(() => UserObjectType, { nullable: false })
  author: UserObjectType;

  @Field(() => Int, { nullable: true })
  parent_id: number;

  @JoinColumnField(TaskComment, TaskComment, 'parent_id')
  @Field(() => TaskCommentObjectType, { nullable: true })
  parent: TaskCommentObjectType;

  @JoinColumnField(TaskComment, TaskComment, 'parent_id')
  @Field(() => [TaskCommentObjectType], { nullable: true })
  replies: TaskCommentObjectType[];

  // @JoinColumnField(TaskComment, TaskComment, 'recipient_id')
  // @Field(() => TaskCommentObjectType, { nullable: true })
  // recipient: TaskCommentObjectType;

  // @JoinColumnField(TaskComment, TaskComment, 'comment_id')
  // @Field(() => [TaskCommentObjectType], { nullable: true })
  // replier_comments: TaskCommentObjectType[];
}
