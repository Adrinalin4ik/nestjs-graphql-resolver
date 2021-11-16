import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskComment } from './task-comment.entity';
import { TaskCommentResolver } from './task-comment.resolver';
import { TaskCommentService } from './task-comment.service';

@Module({
  imports: [TypeOrmModule.forFeature([TaskComment])],
  providers: [TaskCommentResolver, TaskCommentService],
})
export class TaskCommentModule {}
