import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TicketsBoughtService } from './tickets_bought.service';
import { CreateTicketsBoughtDto } from './dto/create-tickets_bought.dto';
import { UpdateTicketsBoughtDto } from './dto/update-tickets_bought.dto';

@Controller('tickets-bought')
export class TicketsBoughtController {
  constructor(private readonly ticketsBoughtService: TicketsBoughtService) {}

  @Post()
  create(@Body() createTicketsBoughtDto: CreateTicketsBoughtDto) {
    return this.ticketsBoughtService.create(createTicketsBoughtDto);
  }

  @Get()
  findAll() {
    return this.ticketsBoughtService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ticketsBoughtService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTicketsBoughtDto: UpdateTicketsBoughtDto) {
    return this.ticketsBoughtService.update(+id, updateTicketsBoughtDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ticketsBoughtService.remove(+id);
  }
}
