import * as bcrypt from 'bcrypt';
import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async signIn(resEmail: string, resPassword: string): Promise<{access_token: string}> {    
    // check if user is found
    const user = await this.usersService.findByEmail(resEmail);
    if (user === null) {
      throw new HttpException("Veuillez vérifier vos identifiants de connexion.", HttpStatus.UNAUTHORIZED)
    }  
    
    // compare passwords
    try {
      const passMatch = await bcrypt.compare(resPassword, user?.password);
      if (!passMatch) {
        throw new HttpException("Veuillez vérifier vos identifiants de connexion.", HttpStatus.UNAUTHORIZED)
      }
    } catch (error) {
      console.log(error);
    }
   

    const payload = { sub: user.id, username: user.email };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
