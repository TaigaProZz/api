import { Body, Controller, Post, HttpCode, HttpStatus, UseGuards, Get, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { AuthGuard } from './auth.guard';
import { Public } from 'src/decorators/public';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Public()
  @Post('login')
  signIn(@Body() signInDto: AuthDto) {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}