import { Controller, Get, Req, NotFoundException, ClassSerializerInterceptor, UseInterceptors } from '@nestjs/common';
import { TicketsBoughtService } from './tickets_bought.service';
import { Permissions } from 'src/decorators/permission.decorator';
import { Request } from 'express';

@Controller('tickets-bought')
export class TicketsBoughtController {
  constructor(
    private readonly ticketsBoughtService: TicketsBoughtService,
  ) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  async findOneUser(@Req() req: Request) {
    const userId = req?.user.id;
    try {
      return this.ticketsBoughtService.findOneUser(+userId);
    } catch (error) {
      console.log(error.message);
      return new NotFoundException('No ticket found');
    }
  }

  @Permissions('admin')
  @Get('all')
  findAllAdmin() {
    return this.ticketsBoughtService.findAll();
  }

  // @Permissions('admin')
  // @Get('all/:id')
  // findOneAdmin(@Param('id') id: string) {
  //   return this.ticketsBoughtService.findOne(+id);
  // }
}
