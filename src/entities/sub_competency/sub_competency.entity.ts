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

@Entity('subcompetency')
export class Subcompetency extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  @Index()
  public competency_id: number;

  @ManyToOne(() => Competency, { nullable: false })
  @JoinColumn({ name: 'competency_id' })
  competency: Competency;

  @OneToMany(() => UserSubcompetency, (userSubcompetency) => userSubcompetency.subcompetency, {
    onDelete: 'CASCADE',
  })
  user_subcompetencies: UserSubcompetency[];
  
  @Column({ nullable: true })
  date_time_with_timezone: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ default: false })
  test_bool: boolean;
}
