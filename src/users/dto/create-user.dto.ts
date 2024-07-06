import { IsBoolean, IsEmail, IsEmpty, IsString, IsStrongPassword, Min } from "class-validator";

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

  permissionId: number;
}
