import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateAuthDto {
  @IsNotEmpty({ message: 'Email is required.' })
  email: string;

  @IsOptional()
  name: string;

  @IsNotEmpty({ message: 'Password is required.' })
  password: string;
}
