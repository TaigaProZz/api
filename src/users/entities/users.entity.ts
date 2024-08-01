import { TicketsBought } from 'src/tickets_bought/entities/tickets_bought.entity';
import { Permission } from 'src/permissions/entities/permission.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, Generated, Unique, OneToMany, BaseEntity } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity()
export class User extends BaseEntity{
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column()
  @Generated("uuid")
  @Exclude()
  generatedKey: string;

  @Column()
  @Unique("unique_email", ["email"])
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column()
  name: string;

  @Column()
  surname: string;
  
  @Column({ default: false })
  doubleAuthActive: boolean;

  @Column({nullable: true})
  @Exclude()
  authSecret: string;

  @Column()
  permissionId: number;
  
  @ManyToOne(() => Permission, permission => permission.users, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  permission: Permission[];

  @OneToMany(() => TicketsBought, ticketBought => ticketBought.user, { onDelete: 'CASCADE' })
  ticketsBought: TicketsBought;
}
