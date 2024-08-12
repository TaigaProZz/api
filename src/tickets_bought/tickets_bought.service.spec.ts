import { Test, TestingModule } from '@nestjs/testing';
import { TicketsBoughtService } from './tickets_bought.service';
import { TicketsBought } from './entities/tickets_bought.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersService } from '../users/users.service';
import { TicketsService } from '../tickets/tickets.service';
import { CreateTicketsBoughtDto } from './dto/create-tickets_bought.dto';
import { v4 as uuidv4 } from 'uuid';

describe('TicketsBoughtService', () => {
  let service: TicketsBoughtService;
  let ticketsBoughtRepository: Repository<TicketsBought>;
  let userService: UsersService;
  let ticketService: TicketsService;

  beforeEach(async () => {
    const mockTicketsBoughtRepository = {
      save: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
    };

    const mockUsersService = {
      findOne: jest.fn(),
    };

    const mockTicketsService = {
      findByPriceId: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TicketsBoughtService,
        { provide: getRepositoryToken(TicketsBought), useValue: mockTicketsBoughtRepository },
        { provide: UsersService, useValue: mockUsersService },
        { provide: TicketsService, useValue: mockTicketsService },
      ],
    }).compile();

    service = module.get<TicketsBoughtService>(TicketsBoughtService);
    ticketsBoughtRepository = module.get<Repository<TicketsBought>>(getRepositoryToken(TicketsBought));
    userService = module.get<UsersService>(UsersService);
    ticketService = module.get<TicketsService>(TicketsService);
  });

  describe('create', () => {
    it('should create a ticket bought entry successfully', async () => {
      const response = {
        userId: 1,
        stripePriceId: 'price_123',
      };

      const date = new Date();
      const userGeneratedKey = 'user_key';
      const generatedKey = uuidv4();
      const finalKey = generatedKey + userGeneratedKey;
      const numberOfPersonsAdmission = 1;
      const ticketId = 1;

      const createTicketsBoughtDto: CreateTicketsBoughtDto = {
        date,
        generatedKey,
        finalKey,
        numberOfPersonsAdmission,
        userId: response.userId,
        ticketId,
      };

      jest.spyOn(userService, 'findOne').mockResolvedValue({ generatedKey } as any);
      jest.spyOn(ticketService, 'findByPriceId').mockResolvedValue({ id: ticketId } as any);
      jest.spyOn(ticketsBoughtRepository, 'save').mockResolvedValue(createTicketsBoughtDto as any);

      expect(await service.create(response)).toEqual(createTicketsBoughtDto);
    });

    it('should handle errors during creation', async () => {
      const response = {
        userId: 1,
        stripePriceId: 'price_123',
      };

      jest.spyOn(userService, 'findOne').mockRejectedValue(new Error('Error'));

      expect(await service.create(response)).toBeInstanceOf(Error);
    });
  });

  describe('findOneUser', () => {
    it('should return tickets bought for a user', async () => {
      const userId = 1;
      const mockTicketBought = { id: 1, userId, ticket: {} };

      jest.spyOn(ticketsBoughtRepository, 'findOne').mockResolvedValue(mockTicketBought as any);

      expect(await service.findOneUser(userId)).toEqual(mockTicketBought);
      expect(ticketsBoughtRepository.findOne).toHaveBeenCalledWith({
        where: { userId },
        relations: ['ticket'],
      });
    });
  });

  describe('findAll', () => {
    it('should return all tickets bought', async () => {
      const mockTicketsBought = [
        { id: 1, userId: 1, ticket: {} },
        { id: 2, userId: 2, ticket: {} },
      ];

      jest.spyOn(ticketsBoughtRepository, 'find').mockResolvedValue(mockTicketsBought as any);

      expect(await service.findAll()).toEqual(mockTicketsBought);
      expect(ticketsBoughtRepository.find).toHaveBeenCalled();
    });
  });
});
