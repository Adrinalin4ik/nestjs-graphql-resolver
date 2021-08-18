import { Column, Entity, AfterInsert, UpdateDateColumn, CreateDateColumn, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';
// import { Base } from '../utils/base.entity';

@Entity('customer')
export class Customer extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  // Timestamps
  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
  
  @Column()
  name: string;

  @AfterInsert()
  test(...args) {
    console.log(args)
  }
}
