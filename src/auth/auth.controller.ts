import { Body, Controller, Post, HttpCode, HttpStatus, Res, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { Public } from 'src/decorators/publicRoute.decorator';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

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
    return res.status(200).send(serviceResponse)
  }

  @Post('logout')
  logout(@Res() res: Response) {
    res.clearCookie('session');
    return res.status(200).send('Successfully logged out')
  }
}