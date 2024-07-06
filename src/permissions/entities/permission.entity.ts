import { User } from "src/users/entities/users.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string

  @OneToMany(() => User, user => user.permission, { onDelete: 'CASCADE' })
  users: User[];
}
