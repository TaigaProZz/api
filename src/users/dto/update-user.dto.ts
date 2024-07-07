import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsBoolean, IsEmail, IsString } from 'class-validator';
import { Exclude } from 'class-transformer';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsEmail()
  email: string;

  @IsString()
  name: string;

  @Exclude()
  password: string;

  @IsString()
  surname: string;

  @IsBoolean()
  doubleAuthActive: boolean;

  @Exclude()
  permissionId?: number;
}
