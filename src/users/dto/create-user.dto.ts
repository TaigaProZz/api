export class CreateUserDto {
  email: string;
  password: string;
  name: string;
  surname: string;
  doubleAuthActive: boolean;
  typeId: number;
}
