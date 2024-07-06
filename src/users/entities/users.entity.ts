import { TicketsBought } from 'src/tickets_bought/entities/tickets_bought.entity';
import { Type } from 'src/type/entities/type.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, Generated, Unique, OneToMany } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column()
  @Generated("uuid")
  generatedKey: string;

  @Column()
  @Unique("unique_email", ["email"])
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column()
  surname: string;
  
  @Column({ default: false })
  doubleAuthActive: boolean;
  
  @ManyToOne(() => Type, type => type.users, { onDelete: 'CASCADE' })
  type: Type;

  @OneToMany(() => TicketsBought, ticketBought => ticketBought.user, { onDelete: 'CASCADE' })
  ticketsBought: TicketsBought;
  
}
