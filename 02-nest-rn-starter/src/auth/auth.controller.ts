import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { JsonAuthGuard } from './passport/json-auth.guard';
import { JwtAuthGuard } from './passport/jwt-auth.guard';
import { Public } from '@/decorator/customize';
import { CreateAuthDto } from './dto/create-auth.dto';
import { MailerService } from '@nestjs-modules/mailer';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly mailerService: MailerService,
  ) {}

  @Post('login')
  @UseGuards(JsonAuthGuard)
  @Public()
  handleLogin(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('register')
  @Public()
  createRegister(@Body() registerDto: CreateAuthDto) {
    return this.authService.handleRegister(registerDto);
  }

  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Get('mail')
  @Public()
  async testMail() {
    await this.mailerService
      .sendMail({
        to: 'homeflight1304@gmail.com', // list of receivers
        subject: 'Testing Nest MailerModule ✔', // Subject line
        text: 'welcome', // plaintext body
        template: 'register', // The `.hbs` file in the `mail/templates` directory
        context: {
          // Data to be sent to template engine
          name: 'Nguyen Van A',
          activationCode: 123456789,
        },
      })
      .then(() => {})
      .catch((e) => {
        console.error(e.message); // in lỗi gốc ra console
        throw new Error('Error sending email');
      });
    return 'ok';
  }
}
