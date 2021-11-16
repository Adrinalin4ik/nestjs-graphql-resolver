import { Resolver } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AutoResolver } from '../../../lib';
// import { CreateTaskCommentDTO } from './dto/create.dto';
import { TaskCommentObjectType } from './dto/task-comment.dto';
import { TaskComment } from './task-comment.entity';

@AutoResolver(TaskCommentObjectType)
@Resolver(() => TaskCommentObjectType)
export class TaskCommentResolver {
  constructor(
    @InjectRepository(TaskComment)
    private readonly taskCommentRepository: Repository<TaskComment>,
  ) {}

  // @AutoMutation(() => TaskCommentObjectType)
  // async createTaskComment(@Args('task_comment') data: CreateTaskCommentDTO) {
  //   return this.taskCommentRepository.save(data);
  // }

  // @ResolveField(() => TaskCommentObjectType)
  // async replies() {
  //   return [{
  //     id: 1
  //   }]
  // }
}
