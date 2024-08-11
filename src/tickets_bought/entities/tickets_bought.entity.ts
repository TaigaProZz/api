import { Exclude } from "class-transformer";
import { Ticket } from "../../tickets/entities/ticket.entity";
import { User } from "../../users/entities/users.entity";
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity()
export class TicketsBought extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  date: Date;

  @Column()
  @Exclude()
  generatedKey: string;

  @Column()
  finalKey: string;

  @Exclude()
  @Column( {default: false} )
  isScanned: boolean;

  @Column()
  ticketId: number;

  @Column()
  @Exclude()
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
