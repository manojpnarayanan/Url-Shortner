import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AUTH_MESSAGES } from '../common/constants/messages.constants';
import { UserMapper } from '../user/mappers/user.mapper';
import { AuthResult, IAuthService } from './interface/IAuth-service';
import { IHashingService } from '../common/security/Ihashing-service';
import { IUserService } from '../user/interface/IUserService';
import { User } from '../user/schema/user.schema';


@Injectable()
export class AuthService implements IAuthService  {
  constructor(
    @Inject("IUserService") private _userService:IUserService,
    @Inject("IHashingService") private _hashingService:IHashingService,
    private readonly _jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto):Promise<AuthResult> {
    const existing = await this._userService.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException(AUTH_MESSAGES.EMAIL_ALREADY_EXISTS);
    }
    const hash = await this._hashingService.hash(dto.password);
    const user = await this._userService.create(dto.email, hash);
    const payload = { sub: user._id.toString(), email: user.email };
    const token = this._jwtService.sign(payload);
    return {
      token,
      user: UserMapper.toResponseDto(user),
    };
  }

  async login(dto: LoginDto):Promise<AuthResult> {
    const user = await this._userService.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException(AUTH_MESSAGES.INVALID_CREDENTIALS);
    }
    const isMatch = await this._hashingService.compare(dto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException(AUTH_MESSAGES.INVALID_CREDENTIALS);
    }
    const payload = { sub: user._id.toString(), email: user.email };
    const token = this._jwtService.sign(payload);
    return {
      token,
      user,
    };
  }
  async getMe(userId: string):Promise<User> {
    const user = await this._userService.findById(userId);
    if (!user) {
      throw new UnauthorizedException(AUTH_MESSAGES.UNAUTHORIZED);
    }
    return user;
  }
}
