import { Module } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { StripeController } from './stripe.controller';
import { TicketsBoughtModule } from 'src/tickets_bought/tickets_bought.module';

@Module({
  imports: [TicketsBoughtModule],
  controllers: [StripeController],
  providers: [StripeService],
})
export class StripeModule {}
