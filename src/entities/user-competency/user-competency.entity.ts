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

@Entity('user_competency')
export class UserCompetency extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Index()
  public competency_id: number;

  @Column()
  @Index()
  public user_id: number;

  @ManyToOne(() => Competency, { nullable: false })
  @JoinColumn({ name: 'competency_id' })
  competency: Competency;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
