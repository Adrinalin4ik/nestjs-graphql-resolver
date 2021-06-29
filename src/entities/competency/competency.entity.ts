import { Field, InputType, Int } from '@nestjs/graphql';
import { EntityObjectType } from '../../../lib';
import {
  AfterUpdate,
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
@Entity('competency')
export class Competency extends BaseEntity {

  // @AfterUpdate()
  // test(entity) {
  //   console.log('test', entity, this)
  // }

  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: false })
  @Index()
  public seniority_id: number;

  @ManyToOne(() => Seniority, { nullable: false })
  @JoinColumn({ name: 'seniority_id' })
  seniority: Seniority;

  @OneToMany(() => Subcompetency, (subcompetency) => subcompetency.competency, {
    onDelete: 'CASCADE',
  })
  subcompetencies: Subcompetency[];

  @OneToMany(() => UserCompetency, (userCompetency) => userCompetency.competency, {
    onDelete: 'CASCADE',
  })
  user_competencies: UserCompetency[];
}
