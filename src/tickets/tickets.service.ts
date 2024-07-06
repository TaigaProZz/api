import { Injectable } from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Ticket } from './entities/ticket.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private ticketRepository: Repository<Ticket>,
  ) {}

  create(createTicketDto: CreateTicketDto): Promise<Ticket> {
    return this.ticketRepository.save(createTicketDto);
  }

  findAll() {
    return this.ticketRepository.find();
  }

  findOne(id: number) {
    return this.ticketRepository.findOne({
      where: { id: id }
    });
  }

  update(id: number, updateTicketDto: UpdateTicketDto) {
    return this.ticketRepository.update({id: id}, updateTicketDto);
  }

  remove(id: number) {
    return this.ticketRepository.delete({id: id});
  }
}
