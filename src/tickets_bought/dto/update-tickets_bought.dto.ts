import { PartialType } from '@nestjs/mapped-types';
import { CreateTicketsBoughtDto } from './create-tickets_bought.dto';

export class UpdateTicketsBoughtDto extends PartialType(CreateTicketsBoughtDto) {}
