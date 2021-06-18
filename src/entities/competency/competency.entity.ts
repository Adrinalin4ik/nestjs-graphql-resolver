import { Field, Int } from '@nestjs/graphql';
import { EntityObjectType } from '../../../lib';
import {
  BaseEntity,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Seniority } from '../seniority/seniority.entity';
import { Subcompetency } from '../sub_competency/sub_competency.entity';
import { UserCompetency } from '../user-competency/user-competency.entity';

@EntityObjectType()
@Entity('competency')
export class Competency extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  title: string;

  @Field(() => Int, { nullable: false })
  @Column({ nullable: false })
  @Index()
  public seniority_id: number;

  @Field(() => Seniority, { nullable: false })
  @ManyToOne(() => Seniority, { nullable: false })
  @JoinColumn({ name: 'seniority_id' })
  seniority: Seniority;

  @Field(() => [Subcompetency], { nullable: true })
  @OneToMany(() => Subcompetency, (subcompetency) => subcompetency.competency, {
    onDelete: 'CASCADE',
  })
  subcompetencies: Subcompetency[];

  @Field(() => [UserCompetency], { nullable: true })
  @OneToMany(() => UserCompetency, (userCompetency) => userCompetency.competency, {
    onDelete: 'CASCADE',
  })
  user_competencies: UserCompetency[];
}
