import { Body, Controller, Post, HttpCode, HttpStatus, Res, Req, BadRequestException, InternalServerErrorException } from '@nestjs/common';
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
    // check credentials and retrieve generated token
    const serviceResponse = await this.authService.signIn(signInDto.email, signInDto.password, signInDto.otpCode);
    const token = serviceResponse.access_token;

    // set cookie
    res.cookie('session', token, {
      httpOnly: true,
      secure: true,
      path: '/',
      sameSite: 'none',
    })
    
    if (serviceResponse.message === "2fa is not activated.") {      
      return res.status(200).send("2fa is not activated.")
    }
    return res.status(200).send("Successfully logged in !")
  }

  // 2fa 
  // to create qr code
  @Post('2fa/setup')
  async setupTwoFactorAuthentication(@Req() req: Request) {
    try {
      const user = req.user;
      
      const getUser = await this.usersService.findByEmail(user.username);
      if (getUser.doubleAuthActive) {
        return new BadRequestException({ message: '2FA is already enabled' });
      }

      // generate secret and otpauth_url
      const { secret, otpauthUrl } = await this.authService.generateTwoFactorSecret(user);

      // link the secret with the user
      await this.usersService.saveTwoFactorSecret(user.id, secret);

      // generate qrcode and send it
      const qrcode = await this.authService.generateQrCode(otpauthUrl);
      return { qrcode: qrcode };
    } catch (error) {
      console.log('Error in generating QR code', error);
      return new InternalServerErrorException({ message: 'Error in generating QR code' });
    }
  }

  // to verify the otp token
  @Post('2fa/verify')
  async verifyTwoFactorAuthentication(@Req() req: Request, @Body() doubleFaVerifyDto: DoubleFaVerifyDto, @Res() res: Response) {
    const user = req.user;

    const getUser = await this.usersService.findByEmail(user.username);

    const isValid = await this.authService.verifyTwoFactorToken(getUser, doubleFaVerifyDto.token);
    if (!isValid) {
      return res.status(400).send('Invalid 2FA token');
    }

    // if user 2fa is not active, activate it
    if (!getUser.doubleAuthActive) {
      await this.usersService.activateTwoFactor(user.id);
    }

    return res.status(200).send('2FA successfully verified.');
  }

  @Post('logout')
  logout(@Res() res: Response) {
    res.clearCookie('session');
    return res.status(200).send('Successfully logged out')
  }
}