import { Injectable } from '@nestjs/common';
import { CreateTicketsBoughtDto } from './dto/create-tickets_bought.dto';
import { UpdateTicketsBoughtDto } from './dto/update-tickets_bought.dto';

@Injectable()
export class TicketsBoughtService {
  create(createTicketsBoughtDto: CreateTicketsBoughtDto) {
    return 'This action adds a new ticketsBought';
  }

  findAll() {
    return `This action returns all ticketsBought`;
  }

  findOne(id: number) {
    return `This action returns a #${id} ticketsBought`;
  }

  update(id: number, updateTicketsBoughtDto: UpdateTicketsBoughtDto) {
    return `This action updates a #${id} ticketsBought`;
  }

  remove(id: number) {
    return `This action removes a #${id} ticketsBought`;
  }
}
