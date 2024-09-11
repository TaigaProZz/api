import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from './users.service';
import { User } from './entities/users.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@test.com',
        password: 'password',
        name: 'Test',
        surname: 'User',
        permissionId: 1,
        doubleAuthActive: false,
        authSecret: null
      };

      const savedUser = { id: 1, ...createUserDto };
      jest.spyOn(repository, 'save').mockResolvedValueOnce(savedUser as User);

      const result = await service.create(createUserDto);
      expect(result).toEqual(savedUser);
      expect(repository.save).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const mockUsers = [{ id: 1, name: 'Test', email: 'test@test.com' }] as User[];

      jest.spyOn(repository, 'find').mockResolvedValueOnce(mockUsers);

      const result = await service.findAll();
      expect(result).toEqual(mockUsers);
      expect(repository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a user by ID', async () => {
      const mockUser = { id: 1, name: 'Test', email: 'test@test.com' } as User;

      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(mockUser);

      const result = await service.findOne(1);
      expect(result).toEqual(mockUser);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });
  });

  describe('findByEmail', () => {
    it('should return a user by email', async () => {
      const mockUser = { id: 1, email: 'test@test.com', permission: {} } as User;

      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(mockUser);

      const result = await service.findByEmail('test@test.com');
      expect(result).toEqual(mockUser);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { email: 'test@test.com' },
        relations: ['permission'],
      });
    });
  });

  // describe('update', () => {
  //   it('should update a user by ID', async () => {
  //     const updateUserDto: UpdateUserDto = { name: 'Updated Name' };

  //     jest.spyOn(repository, 'update').mockResolvedValueOnce({ affected: 1 } as any);

  //     const result = await service.update(1, updateUserDto);
  //     expect(result).toEqual({ affected: 1 });
  //     expect(repository.update).toHaveBeenCalledWith(1, updateUserDto);
  //   });
  // });

  describe('remove', () => {
    it('should delete a user by ID', async () => {
      jest.spyOn(repository, 'delete').mockResolvedValueOnce({ affected: 1 } as any);

      const result = await service.remove(1);
      expect(result).toEqual({ affected: 1 });
      expect(repository.delete).toHaveBeenCalledWith(1);
    });
  });

  describe('saveTwoFactorSecret', () => {
    it('should save the 2FA secret for a user', async () => {
      jest.spyOn(repository, 'update').mockResolvedValueOnce({ affected: 1 } as any);

      const result = await service.saveTwoFactorSecret(1, 'secret');
      expect(result).toEqual({ affected: 1 });
      expect(repository.update).toHaveBeenCalledWith(1, { authSecret: 'secret' });
    });
  });

  describe('activateTwoFactor', () => {
    it('should activate 2FA for a user', async () => {
      jest.spyOn(repository, 'update').mockResolvedValueOnce({ affected: 1 } as any);

      const result = await service.activateTwoFactor(1);
      expect(result).toEqual({ affected: 1 });
      expect(repository.update).toHaveBeenCalledWith(1, { doubleAuthActive: true });
    });
  });


});
