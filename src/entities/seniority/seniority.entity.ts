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
@Entity('seniority')
export class Seniority extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @OneToMany(() => Competency, (competency) => competency.seniority, {
    onDelete: 'CASCADE',
  })
  competencies: Competency[];

  @OneToMany(() => User, (user) => user.seniority)
  users: User[];
}
