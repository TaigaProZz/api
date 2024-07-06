import { Module } from '@nestjs/common';
import { TicketsBoughtService } from './tickets_bought.service';
import { TicketsBoughtController } from './tickets_bought.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketsBought } from './entities/tickets_bought.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TicketsBought])],
  controllers: [TicketsBoughtController],
  providers: [TicketsBoughtService],
})

export class TicketsBoughtModule {}
