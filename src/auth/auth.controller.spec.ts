import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { Response } from 'express';
import { AuthDto } from './dto/auth.dto';
import { DoubleFaVerifyDto } from './dto/doubleFa-verify.dto';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;
  let usersService: UsersService;
  let response: Partial<Response>;

  beforeEach(async () => {
    const mockAuthService = {
      signIn: jest.fn(),
      generateTwoFactorSecret: jest.fn(),
      generateQrCode: jest.fn(),
      verifyTwoFactorToken: jest.fn(),
    };

    const mockUsersService = {
      findByEmail: jest.fn(),
      saveTwoFactorSecret: jest.fn(),
      activateTwoFactor: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: UsersService, useValue: mockUsersService },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);

    response = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      cookie: jest.fn(),
      clearCookie: jest.fn(),
    };
  });

  describe('signIn', () => {
    it('should login and set cookie', async () => {
      const authDto: AuthDto = { email: 'blabla@gmail.com', password: 'password', otpCode: '123456' };
      const serviceResponse = { access_token: 'token', message: 'Success' };

      authService.signIn = jest.fn().mockResolvedValue(serviceResponse);

      await authController.signIn(authDto, response as Response);

      expect(authService.signIn).toHaveBeenCalledWith(authDto.email, authDto.password, authDto.otpCode);
      expect(response.cookie).toHaveBeenCalledWith('session', 'token', {
        httpOnly: true,
        secure: true,
        path: '/',
        sameSite: 'none',
      });
      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.send).toHaveBeenCalledWith("Successfully logged in !");
    });

    it('should handle 2fa not activated message', async () => {
      const authDto: AuthDto = { email: 'blabla@gmail.com', password: 'password', otpCode: '123456' };
      const serviceResponse = { access_token: 'token', message: '2fa is not activated.' };

      authService.signIn = jest.fn().mockResolvedValue(serviceResponse);

      await authController.signIn(authDto, response as Response);

      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.send).toHaveBeenCalledWith("2fa is not activated.");
    });
  });

  describe('setupTwoFactorAuthentication', () => {
    it('should set up 2FA and return QR code', async () => {
      const req: any = { user: { username: 'blabla@gmail.com', id: 1 } };
      const user = { doubleAuthActive: false };
      const secret = 'secret';
      const otpauthUrl = 'otpauth://...';
      const qrcode = 'qrcode';

      usersService.findByEmail = jest.fn().mockResolvedValue(user);
      authService.generateTwoFactorSecret = jest.fn().mockResolvedValue({ secret, otpauthUrl });
      authService.generateQrCode = jest.fn().mockResolvedValue(qrcode);
      usersService.saveTwoFactorSecret = jest.fn().mockResolvedValue(null);

      const result = await authController.setupTwoFactorAuthentication(req);

      expect(usersService.findByEmail).toHaveBeenCalledWith('blabla@gmail.com');
      expect(authService.generateTwoFactorSecret).toHaveBeenCalledWith(req.user);
      expect(usersService.saveTwoFactorSecret).toHaveBeenCalledWith(1, secret);
      expect(authService.generateQrCode).toHaveBeenCalledWith(otpauthUrl);
      expect(result).toEqual({ qrcode });
    });

    it('should handle already enabled 2FA', async () => {
      const req: any = { user: { username: 'blabla@gmail.com' } };
      const user = { doubleAuthActive: true };

      usersService.findByEmail = jest.fn().mockResolvedValue(user);

      try {
        await authController.setupTwoFactorAuthentication(req);
      } catch (e) {
        expect(e).toBeInstanceOf(BadRequestException);
        expect(e.response).toEqual({ message: '2FA is already enabled' });
      }
    });

    it('should handle errors during QR code generation', async () => {
      const req: any = { user: { username: 'blabla@gmail.com' } };
      const user = { doubleAuthActive: false };

      usersService.findByEmail = jest.fn().mockResolvedValue(user);
      authService.generateTwoFactorSecret = jest.fn().mockRejectedValue(new Error('Some error'));

      try {
        await authController.setupTwoFactorAuthentication(req);
      } catch (e) {
        expect(e).toBeInstanceOf(InternalServerErrorException);
        expect(e.response).toEqual({ message: 'Error in generating QR code' });
      }
    });
  });

  describe('verifyTwoFactorAuthentication', () => {
    it('should verify 2FA token and activate 2FA if not active', async () => {
      const req: any = { user: { username: 'blabla@gmail.com' } };
      const doubleFaVerifyDto: DoubleFaVerifyDto = { token: '123456' };
      const user = { doubleAuthActive: false };

      usersService.findByEmail = jest.fn().mockResolvedValue(user);
      authService.verifyTwoFactorToken = jest.fn().mockResolvedValue(true);
      usersService.activateTwoFactor = jest.fn().mockResolvedValue(null);

      await authController.verifyTwoFactorAuthentication(req, doubleFaVerifyDto, response as Response);

      expect(usersService.findByEmail).toHaveBeenCalledWith('blabla@gmail.com');
      expect(authService.verifyTwoFactorToken).toHaveBeenCalledWith(user, doubleFaVerifyDto.token);
      expect(usersService.activateTwoFactor).toHaveBeenCalledWith(req.user.id);
      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.send).toHaveBeenCalledWith('2FA successfully verified.');
    });

    it('should handle invalid 2FA token', async () => {
      const req: any = { user: { username: 'blabla@gmail.com' } };
      const doubleFaVerifyDto: DoubleFaVerifyDto = { token: '123456' };
      const user = { doubleAuthActive: false };

      usersService.findByEmail = jest.fn().mockResolvedValue(user);
      authService.verifyTwoFactorToken = jest.fn().mockResolvedValue(false);

      await authController.verifyTwoFactorAuthentication(req, doubleFaVerifyDto, response as Response);

      expect(response.status).toHaveBeenCalledWith(400);
      expect(response.send).toHaveBeenCalledWith('Invalid 2FA token');
    });
  });

  describe('logout', () => {
    it('should clear cookie and return success message', () => {
      authController.logout(response as Response);

      expect(response.clearCookie).toHaveBeenCalledWith('session');
      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.send).toHaveBeenCalledWith('Successfully logged out');
    });
  });
});
