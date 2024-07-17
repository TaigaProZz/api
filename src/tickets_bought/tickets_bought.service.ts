import { Injectable, ParseUUIDPipe } from '@nestjs/common';
import { CreateTicketsBoughtDto } from './dto/create-tickets_bought.dto';
import { UpdateTicketsBoughtDto } from './dto/update-tickets_bought.dto';
import { TicketsBought } from './entities/tickets_bought.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuidv4 } from 'uuid'
import { UsersService } from 'src/users/users.service';
import { TicketsService } from 'src/tickets/tickets.service';

@Injectable()
export class TicketsBoughtService {
  constructor(
    @InjectRepository(TicketsBought)
    private ticketsBoughtRepository: Repository<TicketsBought>,
    private readonly userService: UsersService,
    private readonly ticketService: TicketsService
  ) {}

  async create(response: any): Promise<CreateTicketsBoughtDto> {

    try {
      const createTicketsBoughtDto = new CreateTicketsBoughtDto();

      // get generated key of user with user id passed in metadata in webhook
      const userGeneratedKey = (await this.userService.findOne(response.userId)).generatedKey;

      // get ticket id with price id fetch before in webhook
      const ticketId = (await this.ticketService.findByPriceId(response.stripePriceId)).id;

      // create and assign unique key for ticket bought
      const myuuid = uuidv4();
      createTicketsBoughtDto.generatedKey = myuuid;

      // create final key
      createTicketsBoughtDto.finalKey = myuuid + userGeneratedKey;

      // assign user id and ticket id
      createTicketsBoughtDto.userId = response.userId;
      createTicketsBoughtDto.ticketId = ticketId;

      return this.ticketsBoughtRepository.save(createTicketsBoughtDto)
    } catch (error) {
      console.log('error ticket bought : ', error);
      return error;
    }
   
  }

  findOneUser(id: number) {    
    return this.ticketsBoughtRepository.findOne({
      where: { userId: id },
      relations: ['ticket']
    });
  }

  findAll() {
    return this.ticketsBoughtRepository.find();
  }
}
