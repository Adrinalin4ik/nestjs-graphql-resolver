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
import { Competency } from '../competency/competency.entity';
import { User } from '../user/user.entity';

@EntityObjectType()
@Entity('user_competency')
export class UserCompetency extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Int)
  @Column()
  @Index()
  public competency_id: number;

  @Field(() => Int)
  @Column()
  @Index()
  public user_id: number;

  @Field(() => Competency, { nullable: true })
  @ManyToOne(() => Competency, { nullable: false })
  @JoinColumn({ name: 'competency_id' })
  competency: Competency;

  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Field(() => String)
  @CreateDateColumn()
  created_at: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updated_at: Date;
}
