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

@EntityObjectType()
@Entity('subcompetency')
export class SubCompetency extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  title: string;

  @Field(() => Int)
  @Column()
  @Index()
  public competency_id: number;

  @Field(() => Competency, { nullable: true })
  @ManyToOne(() => Competency, { nullable: false })
  @JoinColumn({ name: 'competency_id' })
  competency: Competency;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  date_time_with_timezone: Date;

  @Field(() => String)
  @CreateDateColumn()
  created_at: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updated_at: Date;

  @Field(() => Boolean)
  @Column({ default: false })
  test_bool: boolean;
}
