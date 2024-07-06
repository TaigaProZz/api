import { Test, TestingModule } from '@nestjs/testing';
import { TicketsBoughtService } from './tickets_bought.service';

describe('TicketsBoughtService', () => {
  let service: TicketsBoughtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TicketsBoughtService],
    }).compile();

    service = module.get<TicketsBoughtService>(TicketsBoughtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
