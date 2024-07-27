import * as bcrypt from 'bcrypt';
import * as qrcode from 'qrcode';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { authenticator } from 'otplib';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  // basic login
  async signIn(resEmail: string, resPassword: string): Promise<{access_token: string}> {    
    // check if user is found
    const user = await this.usersService.findByEmail(resEmail.toLowerCase());
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
  
  // backoffice login
  async signInBackoffice(resEmail: string, resPassword: string): Promise<any> {
    // check if user is found
    const user = await this.usersService.findByEmail(resEmail.toLowerCase());
    if (user === null) {
      throw new UnauthorizedException("Veuillez vérifier vos identifiants de connexion.")
    }
    
    if(user.permission.name !== 'admin') {
      throw new UnauthorizedException("Veuillez vérifier vos identifiants de connexion.")
    }

    // compare passwords
    const passMatch = await bcrypt.compare(resPassword, user?.password);
    if (!passMatch) {
      throw new UnauthorizedException("Veuillez vérifier vos identifiants de connexion.")
    }

    return Promise.resolve({email: user.email});
  }

  // 2fa
  // generate secret and otpauth_url
  async generateTwoFactorSecret(user: any) {
    const secret = authenticator.generateSecret();    
    const otpauthUrl = authenticator.keyuri(user.username, 'Jo', secret);
    return {
      secret,
      otpauthUrl,
    };
  }

  // generate qrcode
  async generateQrCode(otpauth: string): Promise<string> {
    try {      
      const imageUrl = await qrcode.toDataURL(otpauth);
      return imageUrl;
    } catch (err) {
      console.log('Error with QR');
      throw err;
    }
  }
}
