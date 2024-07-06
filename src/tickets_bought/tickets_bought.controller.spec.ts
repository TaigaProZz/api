import { Test, TestingModule } from '@nestjs/testing';
import { TicketsBoughtController } from './tickets_bought.controller';
import { TicketsBoughtService } from './tickets_bought.service';

describe('TicketsBoughtController', () => {
  let controller: TicketsBoughtController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TicketsBoughtController],
      providers: [TicketsBoughtService],
    }).compile();

    controller = module.get<TicketsBoughtController>(TicketsBoughtController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
