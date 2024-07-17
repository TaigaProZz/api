import { Module } from '@nestjs/common';
import { TicketsBoughtService } from './tickets_bought.service';
import { TicketsBoughtController } from './tickets_bought.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketsBought } from './entities/tickets_bought.entity';
import { UsersModule } from 'src/users/users.module';
import { TicketsModule } from 'src/tickets/tickets.module';

@Module({
  imports: [TypeOrmModule.forFeature([TicketsBought]), UsersModule, TicketsModule],
  controllers: [TicketsBoughtController],
  providers: [TicketsBoughtService],
  exports: [TicketsBoughtService]
})

export class TicketsBoughtModule {}
