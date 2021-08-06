import { Field, Int } from '@nestjs/graphql';
import { EntityObjectType } from '../../../lib';

import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Subcompetency } from '../sub-competency/sub-competency.entity';
import { User } from '../user/user.entity';

@Entity('user_subcompetency')
export class UserSubcompetency extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Index()
  public subcompetency_id: number;

  @Column()
  @Index()
  public user_id: number;

  @ManyToOne(() => Subcompetency, { nullable: false })
  @JoinColumn({ name: 'subcompetency_id' })
  subcompetency: Subcompetency;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
