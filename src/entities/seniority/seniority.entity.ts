import { Field, Int } from '@nestjs/graphql';
import { EntityObjectType } from '../../../lib';
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Competency } from '../competency/competency.entity';
import { User } from '../user/user.entity';
// @EntityObjectType()
@Entity('seniority')
export class Seniority extends BaseEntity {
  // @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  // @Field()
  @Column()
  title: string;

  // @Field(() => [Competency], { nullable: true })
  @OneToMany(() => Competency, (competency) => competency.seniority, {
    onDelete: 'CASCADE',
  })
  competencies: Competency[];

  // @Field(() => [User], { nullable: true })
  @OneToMany(() => User, (user) => user.seniority)
  users: User[];
}
