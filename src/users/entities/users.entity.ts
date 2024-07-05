import { Type } from 'src/type/entities/type.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column()
  generatedKey: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column()
  surname: string;
  
  @Column()
  doubleAuthActive: boolean;
  
  @ManyToOne(() => Type, type => type.users)
  type: Type;
}
