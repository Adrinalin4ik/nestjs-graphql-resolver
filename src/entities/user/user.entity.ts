
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Seniority } from '../seniority/seniority.entity';
import { UserCompetency } from '../user-competency/user-competency.entity';
import { UserSubcompetency } from '../user-subcompetency/user-subcompetency.entity';
import { Task } from '../task/task.entity';
import { Base } from '../utils/base.entity';

@Entity('user')
export class User extends Base {
  @Index()
  @Column({ nullable: true })
  identification_number: number;

  @Index()
  @Column()
  email: string;

  @Column()
  fname: string;

  @Column()
  lname: string;

  @Column({ nullable: true })
  mname: string;

  @Column({ nullable: true })
  age: number;

  @Column({ nullable: true })
  phone: string;

  @Column({ default: true })
  is_active: boolean;

  @Column({ nullable: true })
  @Index()
  public seniority_id: number;

  @ManyToOne(() => Seniority, { nullable: true })
  @JoinColumn({ name: 'seniority_id' })
  seniority: Seniority;

  @OneToMany(() => UserCompetency, (userCompetency) => userCompetency.user, {
    onDelete: 'CASCADE',
  })
  user_competencies: UserCompetency[];

  @OneToMany(
    () => UserSubcompetency,
    (userSubcompetency) => userSubcompetency.user,
    {
      onDelete: 'CASCADE',
    },
  )
  user_subcompetencies: UserSubcompetency[];
  
  @OneToMany(() => Task, (task) => task.assignee)
  tasks: Task[];
}
