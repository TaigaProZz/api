import { Body, Controller, Post, HttpCode, HttpStatus, Res, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { Public } from 'src/decorators/publicRoute.decorator';
import { Response } from 'express';
import { UsersService } from 'src/users/users.service';
import { DoubleFaVerifyDto } from './dto/doubleFa-verify.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private usersService: UsersService) {}

  @HttpCode(HttpStatus.OK)
  @Public()
  @Post('login')
  async signIn(@Body() signInDto: AuthDto, @Res() res: Response) {    
    const serviceResponse = await this.authService.signIn(signInDto.email, signInDto.password);

    const token = serviceResponse.access_token;
    res.cookie('session', token, {
      httpOnly: true,
      secure: true,
      path: '/',
      sameSite: 'none',
    })
    return res.status(200).send("Successfully logged in !")
  }

  @Post('logout')
  logout(@Res() res: Response) {
    res.clearCookie('session');
    return res.status(200).send('Successfully logged out')
  }


  // 2fa 
  // to create qr code
  @Post('2fa/setup')
  async setupTwoFactorAuthentication(@Req() req: Request, @Res() res: Response) {
    try {
      const user = req.user;
      
      const getUser = await this.usersService.findByEmail(user.username);
      if (getUser.doubleAuthActive) {
        return res.status(400).send({ message: '2FA is already enabled' });
      }

      // generate secret and otpauth_url
      const { secret, otpauthUrl } = await this.authService.generateTwoFactorSecret(user);

      // link the secret with the user
      await this.usersService.saveTwoFactorSecret(user.id, secret);

      // generate qrcode and send it
      const qrcode = await this.authService.generateQrCode(otpauthUrl);
      return res.status(200).send({ qrcode: qrcode });
    } catch (error) {
      console.log('Error in generating QR code', error);
      return res.status(500).send({ message: 'Error in generating QR code' });
    }
  }

  // to verify the otp token
  @Post('2fa/verify')
  async verifyTwoFactorAuthentication(@Req() req: Request, @Body() doubleFaVerifyDto: DoubleFaVerifyDto, @Res() res: Response) {
    const user = req.user; 

    const getUser = await this.usersService.findByEmail(user.username);
    if (!getUser.doubleAuthActive) {
      return res.status(400).send({ message: '2FA is not enabled' });
    }    
    const isValid = await this.authService.verifyTwoFactorToken(getUser, doubleFaVerifyDto.token);
    if (!isValid) {
      return res.status(400).send('Invalid 2FA token');
    }

    return res.status(200).send('2FA successfully verified and logged in');
  }
}