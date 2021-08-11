import { Resolver } from '@nestjs/graphql';
import { AutoResolver } from '../../../lib';
import { TaskObjectType } from './task.dto';

@AutoResolver(TaskObjectType)
@Resolver(() => TaskObjectType)
export class TaskResolver {}
