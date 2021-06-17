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
import { SubCompetency } from '../sub_competency/sub_competency.entity';

@EntityObjectType()
@Entity('competency')
export class Competency extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  title: string;

  @Field(() => Int)
  @Column()
  @Index()
  public seniority_id: number;

  @Field(() => Seniority, { nullable: true })
  @ManyToOne(() => Seniority, { nullable: false })
  @JoinColumn({ name: 'seniority_id' })
  seniority: Seniority;

  @Field(() => [SubCompetency], { nullable: true })
  @OneToMany(() => SubCompetency, (subcompetency) => subcompetency.competency, {
    onDelete: 'CASCADE',
  })
  subcompetencies: SubCompetency[];
}
