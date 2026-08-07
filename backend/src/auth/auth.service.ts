import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AUTH_MESSAGES } from '../common/constants/messages.constants';
import { UserMapper } from '../user/mappers/user.mapper';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.userService.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException(AUTH_MESSAGES.EMAIL_ALREADY_EXISTS);
    }
    const hash = await bcrypt.hash(dto.password, 10);
    const user = await this.userService.create(dto.email, hash);
    const payload = { sub: user._id.toString(), email: user.email };
    const token = this.jwtService.sign(payload);
    return {
      token,
      user: UserMapper.toResponseDto(user),
    };
  }

  async login(dto: LoginDto) {
    const user = await this.userService.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException(AUTH_MESSAGES.INVALID_CREDENTIALS);
    }
    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException(AUTH_MESSAGES.INVALID_CREDENTIALS);
    }
    const payload = { sub: user._id.toString(), email: user.email };
    const token = this.jwtService.sign(payload);
    return {
      token,
      user: UserMapper.toResponseDto(user),
    };
  }
  async getMe(userId: string) {
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new UnauthorizedException(AUTH_MESSAGES.UNAUTHORIZED);
    }
    return UserMapper.toResponseDto(user);
  }
}
