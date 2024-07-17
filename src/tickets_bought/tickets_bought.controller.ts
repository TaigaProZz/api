import { Controller, Get, Post, Body, Patch, Param, Delete, Req, NotFoundException } from '@nestjs/common';
import { TicketsBoughtService } from './tickets_bought.service';
import { CreateTicketsBoughtDto } from './dto/create-tickets_bought.dto';
import { Permissions } from 'src/decorators/permission.decorator';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/users.entity';

@Controller('tickets-bought')
export class TicketsBoughtController {
  constructor(
    private readonly ticketsBoughtService: TicketsBoughtService,
    private readonly jwtService: JwtService,
  ) {}

  @Get()
  async findOneUser(@Req() req: Request) {
    const token = req.cookies.session;
    try {
      const tokenContent: User = await this.jwtService.verifyAsync(token);
      return this.ticketsBoughtService.findOne(+tokenContent.id);
    } catch (error) {
      console.log(error.message);
      if (error.message === 'invalid token') {
        throw new NotFoundException('Bad token');
      }
    }
  }

  @Permissions('admin')
  @Get('all')
  findAll() {
    return this.ticketsBoughtService.findAll();
  }

  @Permissions('admin')
  @Get('all/:id')
  findOneAdmin(@Param('id') id: string) {
    return this.ticketsBoughtService.findOne(+id);
  }
}
