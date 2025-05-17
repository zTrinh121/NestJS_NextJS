import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '@/modules/users/users.service';
import { comaprePasswordHelper } from '@/helpers/util';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async signIn(username: string, pass: string): Promise<any> {
    const user = await this.usersService.finndByEmail(username);
     
    const isValidPassword = await comaprePasswordHelper(pass, user.password);
    if (!isValidPassword) {
      throw new UnauthorizedException("Username or password is incorrect");
    }
    const payload = { sub: user._id, username: user.email };
    return {
      access_token: this.jwtService.sign(payload),
    }
  }
}
