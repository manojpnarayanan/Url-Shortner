import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorators';
import { ROUTES } from '../common/constants/routes.constants';
import { AUTH_MESSAGES } from '../common/constants/messages.constants';
import { ApiResponse } from '../common/response/api-response';

@Controller(ROUTES.AUTH.BASE)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  private getCookieOptions() {
    const maxAge = Number(
      this.configService.get<number>('JWT_COOKIE_MAX_AGE_MS', 604800000),
    );
    const isProduction = process.env.NODE_ENV === 'production';
    return {
      httpOnly: true,
      sameSite: (isProduction ? 'none' : 'lax') as 'none' | 'lax',
      secure: isProduction,
      maxAge,
    };
  }

  @Post(ROUTES.AUTH.REGISTER)
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.register(dto);
    res.cookie('jwt', result.token, this.getCookieOptions());
    return ApiResponse.ok(
      result.user,
      AUTH_MESSAGES.REGISTER_SUCCESS,
      HttpStatus.CREATED,
    );
  }

  @Post(ROUTES.AUTH.LOGIN)
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(dto);
    res.cookie('jwt', result.token, this.getCookieOptions());
    return ApiResponse.ok(
      result.user,
      AUTH_MESSAGES.LOGIN_SUCCESS,
      HttpStatus.OK,
    );
  }

  @Post(ROUTES.AUTH.LOGOUT)
  @HttpCode(HttpStatus.OK)
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('jwt', this.getCookieOptions());
    return ApiResponse.ok(
      null,
      AUTH_MESSAGES.LOGOUT_SUCCESS,
      HttpStatus.OK,
    );
  }

  @Get(ROUTES.AUTH.ME)
  @UseGuards(JwtAuthGuard)
  async getMe(@CurrentUser() user: { id: string; email: string }) {
    const result = await this.authService.getMe(user.id);
    return ApiResponse.ok(
      result,
      AUTH_MESSAGES.PROFILE_FETCHED,
      HttpStatus.OK,
    );
  }
}
