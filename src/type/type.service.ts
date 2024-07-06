import { Injectable } from '@nestjs/common';
import { CreateTypeDto } from './dto/create-type.dto';
import { UpdateTypeDto } from './dto/update-type.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Type } from './entities/type.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TypeService {
  constructor(
    @InjectRepository(Type)
    private typeRepository: Repository<Type>,
  ) {}

  create(createTypeDto: CreateTypeDto): Promise<Type> {
    return this.typeRepository.save(createTypeDto);
  }

  findAll() {
    return this.typeRepository.find();
  }

  findOne(id: number): Promise<Type> {
    return this.typeRepository.findOne({ where: { id }, relations: ['users'] });
  }

  update(id: number, updateTypeDto: UpdateTypeDto) {
    return `This action updates a #${id} type`;
  }

  remove(id: number) {
    return `This action removes a #${id} type`;
  }
}
