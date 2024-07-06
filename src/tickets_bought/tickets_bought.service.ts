import { Injectable, ParseUUIDPipe } from '@nestjs/common';
import { CreateTicketsBoughtDto } from './dto/create-tickets_bought.dto';
import { UpdateTicketsBoughtDto } from './dto/update-tickets_bought.dto';
import { TicketsBought } from './entities/tickets_bought.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuidv4 } from 'uuid'

@Injectable()
export class TicketsBoughtService {
  constructor(
    @InjectRepository(TicketsBought)
    private ticketsBoughtRepository: Repository<TicketsBought>,
  ) {}

  async create(createTicketsBoughtDto: CreateTicketsBoughtDto) {
    console.log(createTicketsBoughtDto.generatedKey);
    const myuuid = uuidv4();
    const userUuid = uuidv4();

    createTicketsBoughtDto.generatedKey = myuuid;

    // to adjust later when authorization and token will be implemented
    createTicketsBoughtDto.finalKey = myuuid + userUuid;
    createTicketsBoughtDto.userId = 1;
    createTicketsBoughtDto.ticketId = 1;
    
    return this.ticketsBoughtRepository.save(createTicketsBoughtDto)
  }

  findAll() {
    return this.ticketsBoughtRepository.find();
  }

  findOne(id: number) {
    return this.ticketsBoughtRepository.findOne({
      where: {id: id}
    });
  }
}
