import { IsEmail, IsEmpty, IsString } from "class-validator";

export class CreateUserDto {
  @IsEmail()
  email: string;

  password: string;

  @IsString()
  name: string;

  @IsString()
  surname: string;

  @IsEmpty()
  doubleAuthActive: boolean;

  @IsEmpty()
  authSecret: string;

  permissionId: number;
}
