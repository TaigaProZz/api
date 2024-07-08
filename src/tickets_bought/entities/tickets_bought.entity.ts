import { Ticket } from "src/tickets/entities/ticket.entity";
import { User } from "src/users/entities/users.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity()
export class TicketsBought {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  date: Date;

  @Column()
  generatedKey: string;

  @Column()
  finalKey: string;

  @Column()
  numberOfPersonsAdmission: number;

  @Column( {default: false} )
  isScanned: boolean;

  @Column()
  ticketId: number;

  @Column()
  userId: number;

  @ManyToOne(() => User, user => user.ticketsBought, { 
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @Unique("unique_user", ["user"])
  user: User[];

  @ManyToOne(() => Ticket, ticket => ticket.id, { onDelete: 'CASCADE' })
  ticket: Ticket[];
}
