import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { UrlService } from './url.service';
import { CreateUrlDto } from './dto/create-url.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorators';
import { ROUTES } from '../common/constants/routes.constants';
import { URL_MESSAGES } from '../common/constants/messages.constants';
import { ApiResponse } from '../common/response/api-response';

@Controller(ROUTES.URLS.BASE)
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() dto: CreateUrlDto,
    @CurrentUser() user: { id: string },
  ) {
    const result = await this.urlService.create(dto, user.id);
    return ApiResponse.ok(
      result,
      URL_MESSAGES.CREATED,
      HttpStatus.CREATED,
    );
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(@CurrentUser() user: { id: string }) {
    const result = await this.urlService.findAllByUser(user.id);
    return ApiResponse.ok(
      result,
      URL_MESSAGES.FETCHED,
      HttpStatus.OK,
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async delete(
    @Param('id') id: string,
    @CurrentUser() user: { id: string },
  ) {
    await this.urlService.delete(id, user.id);
    return ApiResponse.ok(
      null,
      URL_MESSAGES.DELETED,
      HttpStatus.OK,
    );
  }
}
