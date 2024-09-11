import * as bcrypt from 'bcrypt';

import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { authenticator } from 'otplib';
import { AuthController } from './auth.controller';

// mock libs
jest.mock('bcrypt');
jest.mock('otplib');

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findByEmail: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should throw UnauthorizedException if user is not found', async () => {
    (usersService.findByEmail as jest.Mock).mockResolvedValue(null);

    await expect(authService.signIn('blabla@gmail.com', 'password', ''))
      .rejects
      .toThrow(UnauthorizedException);
  });

  it('should throw UnauthorizedException if password does not match', async () => {
    const mockUser = { email: 'blabla@gmail.com', password: 'hashedpassword' };
    (usersService.findByEmail as jest.Mock).mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await expect(authService.signIn('blabla@gmail.com', 'wrongpassword', ''))
      .rejects
      .toThrow(UnauthorizedException);
  });

  it('should return token if 2FA is not activated', async () => {
    const mockUser = { email: 'blabla@gmail.com', password: 'hashedpassword', doubleAuthActive: false };
    (usersService.findByEmail as jest.Mock).mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (jwtService.signAsync as jest.Mock).mockResolvedValue('token');

    const result = await authService.signIn('blabla@gmail.com', 'password', '');
    expect(result).toEqual({ message: '2fa is not activated.', access_token: 'token' });
  });

  it('should throw BadRequestException if 2FA code is missing', async () => {
    const mockUser = { email: 'blabla@gmail.com', password: 'hashedpassword', doubleAuthActive: true };
    (usersService.findByEmail as jest.Mock).mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    await expect(authService.signIn('blabla@gmail.com', 'password', ''))
      .rejects
      .toThrow(BadRequestException);
  });

  it('should throw UnauthorizedException if 2FA code is invalid', async () => {
    const mockUser = { email: 'blabla@gmail.com', password: 'hashedpassword', doubleAuthActive: true, authSecret: 'secret' };
    (usersService.findByEmail as jest.Mock).mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (authenticator.verify as jest.Mock).mockReturnValue(false);

    await expect(authService.signIn('blabla@gmail.com', 'password', 'wrongcode'))
      .rejects
      .toThrow(UnauthorizedException);
  });

  it('should return token if 2FA code is valid', async () => {
    const mockUser = { email: 'blabla@gmail.com', password: 'hashedpassword', doubleAuthActive: true, authSecret: 'secret' };
    (usersService.findByEmail as jest.Mock).mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (authenticator.verify as jest.Mock).mockReturnValue(true);
    (jwtService.signAsync as jest.Mock).mockResolvedValue('token');

    const result = await authService.signIn('blabla@gmail.com', 'password', 'validcode');
    expect(result).toEqual({ message: 'Successfully logged in !', access_token: 'token' });
  });

  describe('AuthService - verifyTwoFactorCode', () => {
    it('should throw UnauthorizedException if 2FA code is invalid', async () => {
      const user = { authSecret: 'secret' };
      const token = 'invalidcode';

      (authenticator.verify as jest.Mock).mockReturnValue(false);

      await expect(authService.verifyTwoFactorToken(user, token))
        .rejects
        .toThrow(UnauthorizedException);
    });

    it('should return true if 2FA code is valid', async () => {
      const user = { authSecret: 'secret' };
      const token = 'validcode';

      (authenticator.verify as jest.Mock).mockReturnValue(true);

      const result = await authService.verifyTwoFactorToken(user, token);
      expect(result).toBe(true);
    });
  });


});
