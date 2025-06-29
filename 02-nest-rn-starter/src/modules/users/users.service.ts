import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { hashPasswordHelper } from '@/helpers/util';
import aqp from 'api-query-params';
import { CreateAuthDto } from '@/auth/dto/create-auth.dto';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private readonly mailerService: MailerService,
  ) {}

  isEmailExist = async (email: string) => {
    const user = await this.userModel.exists({ email });
    if (user) return true;
    return false;
  };

  async create(createUserDto: CreateUserDto) {
    const { name, email, password, phone, address, image } = createUserDto;

    //check if email already exists
    const isEmailExist = await this.isEmailExist(email);
    if (isEmailExist) {
      throw new BadRequestException(
        `Email ${email} already exists. Please use another email.`,
      );
    }
    //hash password
    const hashPassword = await hashPasswordHelper(password);
    const newUser = await this.userModel.create({
      name,
      email,
      password: hashPassword,
      phone,
      address,
      image,
    });
    return {
      id: newUser._id,
    };
  }

  async findAll(query: string, current: number, pageSize: number) {
    const { filter, limit, sort } = aqp(query);
    if (filter.current) delete filter.current;
    if (filter.pageSize) delete filter.pageSize;

    if (!current) current = 1;
    if (!pageSize) pageSize = 10;

    const totalItems = (await this.userModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const skip = (current - 1) * pageSize;

    const results = await this.userModel
      .find(filter)
      .select('-password')
      .limit(limit)
      .skip(skip)
      .sort(sort as any);
    return { results, totalPages };
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async update(updateUserDto: UpdateUserDto) {
    return await this.userModel.updateOne(
      {
        _id: updateUserDto._id,
      },
      { ...updateUserDto },
    );
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async findByEmail(email: string) {
    return await this.userModel.findOne({ email });
  }

  async handleRegister(registerDto: CreateAuthDto) {
    const { name, email, password } = registerDto;
    // Check if email already exists
    const isEmailExist = await this.isEmailExist(email);
    if (isEmailExist) {
      throw new BadRequestException(
        `Email ${email} already exists. Please use another email.`,
      );
    }

    // Hash password
    const hashPassword = await hashPasswordHelper(password);

    // Create new user
    const codeId = uuidv4();
    const newUser = await this.userModel.create({
      ...registerDto,
      isActive: false,
      codeId,
      codeExpired: dayjs().add(5, 'minutes'),
      password: hashPassword,
    });

    //Send activation email
   await this.mailerService
      .sendMail({
        to: newUser.email, // list of receivers
        subject: 'Activation Email', // Subject line
        template: 'register', // The `.hbs` file in the `mail/templates` directory
        context: {
          // Data to be sent to template engine
          name: newUser?.name ?? newUser.email,
          activationCode: newUser.codeId,
        },
      });

    return {
      id: newUser._id,
      message: 'User registered successfully',
    };
  }
}
