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
    // check if user is found
    const user = await this.usersService.findByEmail(resEmail);
    if (user === null) {
      throw new UnauthorizedException("Veuillez vérifier vos identifiants de connexion.")
    }
    
    // compare passwords
    const passMatch = await bcrypt.compare(resPassword, user?.password);
    if (!passMatch) {
      throw new UnauthorizedException("Veuillez vérifier vos identifiants de connexion.")
    }
  
    const payload = { id: user.id, username: user.email, permission: user.permission.name };
    
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
  
  async signInBackoffice(resEmail: string, resPassword: string): Promise<any> {
    // check if user is found
    const user = await this.usersService.findByEmail(resEmail);
    if (user === null) {
      throw new UnauthorizedException("Veuillez vérifier vos identifiants de connexion.")
    }

    // compare passwords
    const passMatch = await bcrypt.compare(resPassword, user?.password);
    if (!passMatch) {
      throw new UnauthorizedException("Veuillez vérifier vos identifiants de connexion.")
    }

    return Promise.resolve({email: user.email});
  }

}
