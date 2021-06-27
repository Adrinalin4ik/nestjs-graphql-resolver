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
import { Subcompetency } from '../sub_competency/sub_competency.entity';
import { User } from '../user/user.entity';

// @EntityObjectType()
@Entity('user_subcompetency')
export class UserSubcompetency extends BaseEntity {
  // @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  // @Field(() => Int)
  @Column()
  @Index()
  public subcompetency_id: number;

  // @Field(() => Int)
  @Column()
  @Index()
  public user_id: number;

  // @Field(() => Subcompetency, { nullable: true })
  @ManyToOne(() => Subcompetency, { nullable: false })
  @JoinColumn({ name: 'subcompetency_id' })
  subcompetency: Subcompetency;

  // @Field(() => User, { nullable: true })
  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  // @Field(() => String)
  @CreateDateColumn()
  created_at: Date;

  // @Field(() => String)
  @UpdateDateColumn()
  updated_at: Date;
}
