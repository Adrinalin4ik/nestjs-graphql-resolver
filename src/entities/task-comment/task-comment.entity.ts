import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne, OneToMany, PrimaryGeneratedColumn
} from 'typeorm';
import { Task } from '../task/task.entity';
import { User } from '../user/user.entity';
import { Base } from '../utils/base.entity';

@Entity('task_comment')
export class TaskComment extends Base {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  html_content: string;

  @Column({ nullable: false })
  author_id: number;

  @Column({ nullable: false })
  @Index()
  task_id: number;

  @ManyToOne(() => Task, { nullable: false })
  @JoinColumn({ name: 'task_id' })
  task: Task;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'author_id' })
  author: User;

  @Column({ nullable: true })
  parent_id: number;

  @ManyToOne(() => TaskComment, { nullable: true })
  @JoinColumn({ name: 'parent_id' })
  parent: TaskComment;

  @OneToMany(() => TaskComment, (taskComment) => taskComment.parent)
  @JoinColumn({ name: 'parent_id' })
  replies: TaskComment;
  //
  // @OneToMany(() => TaskComment, (taskComment) => taskComment.recipient)
  // replier_comments: TaskComment[];
}
