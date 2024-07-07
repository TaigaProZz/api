import { PartialType } from '@nestjs/mapped-types';
import { CreateTicketDto } from './create-ticket.dto';
import { Exclude } from 'class-transformer';

export class UpdateTicketDto extends PartialType(CreateTicketDto) {
  @Exclude()
  id: number;
}
