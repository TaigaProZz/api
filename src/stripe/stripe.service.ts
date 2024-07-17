import { Injectable, RawBodyRequest } from '@nestjs/common';
import { response } from 'express';

import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe;

  constructor() {
    this.stripe = new Stripe('sk_test_51PL00TGi4gZxSBlJkgNbQgNkeUuARk5inBjaiTdaLZg3kflPY0JrVykUKIW1V2v756LhI70KCey6zduS0AcLt5Ta00RgBAjGx6');
  }

  async createCheckout(body: JSON, id: number) {
    const stripePriceId = body['stripePriceId']<string>;
    
    return await this.stripe.checkout.sessions.create({
      line_items: 
      [{
        price: stripePriceId,
          quantity: 1,
      }],
      mode: 'payment',
      success_url: `http://localhost:5173/?success=true`,
      cancel_url: `http://localhost:5173/?canceled=true`,
      metadata: {
        userId: id,
      }
      
    });
  }

  async webhook(req: RawBodyRequest<Request>) {
    const payload = req.rawBody;
    const sig = req.headers['stripe-signature'];
    let event;    

    // verify webhook signature
    try {
      event = this.stripe.webhooks.constructEvent(payload, sig, 'whsec_ecb65f1eb8e752eb2e88ca9cee2f1fc60b379c59d4c9ba1228b636bc19b47387');      
    } catch (err) {
      console.log('erreur', err);
      return `Webhook Error: ${err.message}`;
    }
    
    // handle events
    switch (event.type) {
      // payement success
      case 'checkout.session.completed':
        try {
          const session = event.data.object;
          const priceId = await this.getStripePriceId(session.id);
          console.log("priceId: ", priceId);
          
          // console.log("session: ", session);
          return { userId: session.metadata.userId, stripePriceId: priceId };
        } catch (error) {
          console.log('error', error);
        } 

      default:
        console.log(`Unhandled event type ${event.type}`);
    }
    return;
  }

  async getStripePriceId(sessionId: string) {
    const checkoutSession = await this.stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items'],
    });

    const lineItems = await this.stripe.checkout.sessions.listLineItems(
      checkoutSession.id
    );
    
    return lineItems.data[0].price.id;
  }


  findAll() {
    return `This action returns all stripe`;
  }

  findOne(id: number) {
    return `This action returns a #${id} stripe`;
  }

  update() {
    return `This action updates a #${id} stripe`;
  }

  remove(id: number) {
    return `This action removes a #${id} stripe`;
  }
}
