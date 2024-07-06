import * as bcrypt from 'bcrypt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async signIn(resEmail: string, resPassword: string): Promise<{access_token: string}> {
    console.log(resEmail, resPassword);
    
    const user = await this.usersService.findByEmail(resEmail);
    
    const passMatch = await bcrypt.compare(resPassword, user?.password);
    if (!passMatch) {
      throw new UnauthorizedException();
    }

    const payload = { sub: user.id, username: user.email };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
