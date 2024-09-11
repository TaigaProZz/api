import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { User } from './entities/users.entity';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            create: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            verifyAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('create', () => {
    it('should hash the password and create a new user', async () => {
      const createUserDto: CreateUserDto = { email: 'test@test.com', password: '123456', permissionId: 1, doubleAuthActive: false, name: 'test', surname: 'test', authSecret: null };
      jest.spyOn(usersService, 'create').mockResolvedValueOnce(undefined);

      const result = await controller.create(createUserDto);

      expect(result).toEqual({
        code: 201,
        message: 'User created successfully',
      });
      expect(usersService.create).toHaveBeenCalledWith(expect.objectContaining({
        email: 'test@test.com',
        password: expect.any(String), // hashed password
        permissionId: 1,
      }));
    });

    it('should throw BadRequestException if email already exists', async () => {
      const createUserDto: CreateUserDto = { email: 'test@test.com', password: '123456', permissionId: 1, doubleAuthActive: false, name: 'test', surname: 'test', authSecret: null};
      jest.spyOn(usersService, 'create').mockRejectedValueOnce({ code: '23505' });

      await expect(controller.create(createUserDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findOne', () => {
    it('should return the user if 2fa is activated', async () => {
      const mockUser = { id: 1, doubleAuthActive: true };

      jest.spyOn(usersService, 'findOne').mockResolvedValueOnce(mockUser as User);

      const req = { user: { id: 1 } };
      const result = await controller.findOne(req);

      expect(result).toEqual(mockUser);
      expect(usersService.findOne).toHaveBeenCalledWith(1);
    });

    it('should throw BadRequestException if 2fa is not activated', async () => {
      const mockUser = { id: 1 };

      jest.spyOn(usersService, 'findOne').mockResolvedValueOnce(mockUser as User);

      const req = { user: { id: 1 } };

      await expect(controller.findOne(req)).rejects.toThrow(BadRequestException);
    });
  });


  // describe('update', () => {
  //   it('should update the user information', async () => {
  //     const updateUserDto: UpdateUserDto = { email: 'updated@test.com', password: 'newpassword' };
  //     const mockTokenContent = { id: 1 };

  //     jest.spyOn(jwtService, 'verifyAsync').mockResolvedValueOnce(mockTokenContent);
  //     jest.spyOn(usersService, 'update').mockResolvedValueOnce(undefined);

  //     const req = { cookies: { session: 'fake-token' } } as any;
  //     await controller.update(req, updateUserDto);

  //     expect(jwtService.verifyAsync).toHaveBeenCalledWith('fake-token');
  //     expect(usersService.update).toHaveBeenCalledWith(1, updateUserDto);
  //   });

  //   it('should throw NotFoundException for invalid token', async () => {
  //     jest.spyOn(jwtService, 'verifyAsync').mockRejectedValueOnce(new Error('invalid token'));

  //     const req = { cookies: { session: 'fake-token' } } as any;
  //     const updateUserDto: UpdateUserDto = { email: 'updated@test.com', password: 'newpassword' };

  //     await expect(controller.update(req, updateUserDto)).rejects.toThrow(NotFoundException);
  //   });
  // });

  describe('remove', () => {
    it('should remove the user', async () => {
      const mockTokenContent = { id: 1 };

      jest.spyOn(jwtService, 'verifyAsync').mockResolvedValueOnce(mockTokenContent);
      jest.spyOn(usersService, 'remove').mockResolvedValueOnce(undefined);

      const req = { cookies: { session: 'fake-token' } } as any;
      await controller.remove(req);

      expect(jwtService.verifyAsync).toHaveBeenCalledWith('fake-token');
      expect(usersService.remove).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException for invalid token', async () => {
      jest.spyOn(jwtService, 'verifyAsync').mockRejectedValueOnce(new Error('invalid token'));

      const req = { cookies: { session: 'fake-token' } } as any;

      await expect(controller.remove(req)).rejects.toThrow(NotFoundException);
    });
  });
});
