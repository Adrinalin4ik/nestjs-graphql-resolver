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
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Competency } from '../competency/competency.entity';
import { UserSubcompetency } from '../user-subcompetency/user-subcompetency.entity';

// @EntityObjectType()
@Entity('subcompetency')
export class Subcompetency extends BaseEntity {
  // @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  // @Field()
  @Column()
  title: string;

  // @Field(() => Int)
  @Column()
  @Index()
  public competency_id: number;

  // @Field(() => Competency, { nullable: true })
  @ManyToOne(() => Competency, { nullable: false })
  @JoinColumn({ name: 'competency_id' })
  competency: Competency;

  // @Field(() => [UserSubcompetency], { nullable: true })
  @OneToMany(() => UserSubcompetency, (userSubcompetency) => userSubcompetency.subcompetency, {
    onDelete: 'CASCADE',
  })
  user_subcompetencies: UserSubcompetency[];
  
  // @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  date_time_with_timezone: Date;

  // @Field(() => String)
  @CreateDateColumn()
  created_at: Date;

  // @Field(() => String)
  @UpdateDateColumn()
  updated_at: Date;

  // @Field(() => Boolean)
  @Column({ default: false })
  test_bool: boolean;
}
