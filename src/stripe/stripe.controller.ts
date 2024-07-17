import { Controller, Get, Post, Body, Req, RawBodyRequest} from '@nestjs/common';
import { StripeService } from './stripe.service';
import { Public } from 'src/decorators/publicRoute.decorator';
import { TicketsBoughtService } from 'src/tickets_bought/tickets_bought.service';

@Controller('stripe')
export class StripeController {
  constructor(
    private readonly stripeService: StripeService, 
    private readonly ticketBoughtService: TicketsBoughtService
  ) {}

  @Post()
  async createSession(@Body() body: any, @Req() req: Request): Promise<{ url: string }> {
    try {
      const session = await this.stripeService.createCheckout(body, req?.user.id);
      return { url: session.url };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  
  @Public()
  @Post('webhook')
  async webhook(@Req() req: RawBodyRequest<Request>): Promise<any> {
    try {
      const response = await this.stripeService.webhook(req);
      
      // check if response is not null ( not null when payment is success)
      if(response) {
        console.log('responseController', response);
        return this.ticketBoughtService.create(response);
      }
      
      return {received: true};
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
