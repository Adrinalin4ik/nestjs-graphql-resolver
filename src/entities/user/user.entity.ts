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
import { Seniority } from '../seniority/seniority.entity';
import { UserCompetency } from '../user-competency/user-competency.entity';
import { UserSubcompetency } from '../user-subcompetency/user-subcompetency.entity';

@EntityObjectType()
@Entity('user')
export class User extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Int)
  @Index()
  @Column({ nullable: true })
  identification_number: number;

  @Field()
  @Index()
  @Column()
  email: string;

  @Field()
  @Column()
  fname: string;

  @Field()
  @Column()
  lname: string;

  @Field()
  @Column({ nullable: true })
  mname: string;

  @Field()
  @Column({ nullable: true })
  age: number;

  @Field()
  @Column({ nullable: true })
  phone: string;

  @Field()
  @Column({ default: true })
  is_active: boolean;

  @Field(() => Int)
  @Column({ nullable: true })
  @Index()
  public seniority_id: number;

  @Field(() => Seniority, { nullable: true })
  @ManyToOne(() => Seniority, { nullable: true })
  @JoinColumn({ name: 'seniority_id' })
  seniority: Seniority;

  @Field(() => [UserCompetency], { nullable: true })
  @OneToMany(() => UserCompetency, (userCompetency) => userCompetency.user, {
    onDelete: 'CASCADE',
  })
  user_competencies: UserCompetency[];

  @Field(() => [UserSubcompetency], { nullable: true })
  @OneToMany(
    () => UserSubcompetency,
    (userSubcompetency) => userSubcompetency.user,
    {
      onDelete: 'CASCADE',
    },
  )
  user_subcompetencies: UserSubcompetency[];

  // Timestamps
  @Field(() => String)
  @CreateDateColumn()
  created_at: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updated_at: Date;
}
