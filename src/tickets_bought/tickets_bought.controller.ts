import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TicketsBoughtService } from './tickets_bought.service';
import { CreateTicketsBoughtDto } from './dto/create-tickets_bought.dto';
import { Permissions } from 'src/decorators/permission.decorator';

@Controller('tickets-bought')
export class TicketsBoughtController {
  constructor(private readonly ticketsBoughtService: TicketsBoughtService) {}

  @Permissions('admin')
  @Post()
  create(@Body() createTicketsBoughtDto: CreateTicketsBoughtDto) {
    return this.ticketsBoughtService.create(createTicketsBoughtDto);
  }

  @Permissions('admin')
  @Get()
  findAll() {
    return this.ticketsBoughtService.findAll();
  }

  @Permissions('admin')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ticketsBoughtService.findOne(+id);
  }
}
