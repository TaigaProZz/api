import { Controller, Get, Post, Body, Param, Delete, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { Public } from 'src/decorators/publicRoute.decorator';
import { Permissions } from 'src/decorators/permission.decorator';

@Controller('ticket')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}
  
  @Permissions('admin')
  @Post()
  create(@Body() createTicketDto: CreateTicketDto) {
    return this.ticketsService.create(createTicketDto);
  }

  @Public()
  @Get()
  findAll() {
    return this.ticketsService.findAll();
  }
  
  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ticketsService.findOne(+id);
  }

  @Permissions('admin')
  @UsePipes(new ValidationPipe({ transform: true }))
  @Put(':id')
  update(@Param('id') id: string, @Body() updateTicketDto: UpdateTicketDto) {
    return this.ticketsService.update(+id, updateTicketDto);
  }

  @Permissions('admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ticketsService.remove(+id);
  }
}
