import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { IUrlService } from './interface/url-service.interface'; 
import { CreateUrlDto } from './dto/create-url.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorators';
import { UrlMapper } from './mappers/url.mappers';
import { ROUTES } from '../common/constants/routes.constants';
import { URL_MESSAGES } from '../common/constants/messages.constants';
import { ApiResponse } from '../common/response/api-response';

@Controller(ROUTES.URLS.BASE)
export class UrlController {
  constructor(@Inject("IUrlService") private readonly _urlService: IUrlService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() dto: CreateUrlDto,
    @CurrentUser() user: { id: string },
  ) {
    const url = await this._urlService.create(dto, user.id);
    return ApiResponse.ok(
      url,
      URL_MESSAGES.CREATED,
      HttpStatus.CREATED,
    );
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(@CurrentUser() user: { id: string }) {
    const urls = await this._urlService.findAllByUser(user.id);

    return ApiResponse.ok(
      urls,
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
    await this._urlService.delete(id, user.id);
    return ApiResponse.ok(
      null,
      URL_MESSAGES.DELETED,
      HttpStatus.OK,
    );
  }
}
