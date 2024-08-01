import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/users.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    return this.userRepository.save(createUserDto);
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  findOne(id: number): Promise<User> {
    return this.userRepository.findOne({
      where: { id: id }
    });
  }

  findByEmail(email: string) {
    return this.userRepository.findOne({
      where: {email: email},
      relations: ['permission'],
    })
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.userRepository.update(id, updateUserDto);
  }

  remove(id: number) {
    return this.userRepository.delete(id);
  }

  async saveTwoFactorSecret(userId: number, secret: string) {
    return await this.userRepository.update(userId, { authSecret: secret });
  }

  async activateTwoFactor(userId: number) {
    return await this.userRepository.update(userId, { doubleAuthActive: true });
  }
}
