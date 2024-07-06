import { User } from "src/users/entities/users.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Type {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userType: string

  @OneToMany(() => User, user => user.type, { onDelete: 'CASCADE'})
  users: User[];
}
