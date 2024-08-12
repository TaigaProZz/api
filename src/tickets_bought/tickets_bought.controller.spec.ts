import { Test, TestingModule } from '@nestjs/testing';
import { TicketsBoughtController } from './tickets_bought.controller';
import { TicketsBoughtService } from './tickets_bought.service';
import { NotFoundException } from '@nestjs/common';

describe('TicketsBoughtController', () => {
  let ticketsBoughtController: TicketsBoughtController;
  let ticketsBoughtService: TicketsBoughtService;

  beforeEach(async () => {
    const mockTicketsBoughtService = {
      findOneUser: jest.fn(),
      findAll: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TicketsBoughtController],
      providers: [
        { provide: TicketsBoughtService, useValue: mockTicketsBoughtService },
      ],
    }).compile();

    ticketsBoughtController = module.get<TicketsBoughtController>(TicketsBoughtController);
    ticketsBoughtService = module.get<TicketsBoughtService>(TicketsBoughtService);
  });

  describe('findOneUser', () => {
    it('should return tickets for the user', async () => {
      const userId = 1;
      const mockTickets = [{ id: 1, name: 'Ticketttt 1' }];

      jest.spyOn(ticketsBoughtService, 'findOneUser').mockResolvedValue(mockTickets as any);

      const req = { user: { id: userId } };


      expect(await ticketsBoughtController.findOneUser(req)).toEqual(mockTickets);
      expect(ticketsBoughtService.findOneUser).toHaveBeenCalledWith(userId);
    });

    it('should throw NotFoundException if no tickets found', async () => {
      const userId = 1;
      jest.spyOn(ticketsBoughtService, 'findOneUser').mockRejectedValue(new NotFoundException('No ticket found'));

      const req = { user: { id: userId } } ;

      await expect(ticketsBoughtController.findOneUser(req)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAllAdmin', () => {
    it('should return all tickets (admin route)', async () => {
      const mockTickets = [{ id: 1, name: 'Ticket testt 1' }, { id: 2, name: 'Ticket test 2' }];

      jest.spyOn(ticketsBoughtService, 'findAll').mockResolvedValue(mockTickets as any);

      expect(await ticketsBoughtController.findAllAdmin()).toEqual(mockTickets);
      expect(ticketsBoughtService.findAll).toHaveBeenCalled();
    });
  });
});
