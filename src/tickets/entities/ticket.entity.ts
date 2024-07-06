import { TicketsBought } from "src/tickets_bought/entities/tickets_bought.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Ticket {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  price: number;

  @OneToMany(() => TicketsBought, ticketBought => ticketBought.ticket, { onDelete: 'CASCADE' }) 
  ticketsBought: TicketsBought[];
}
