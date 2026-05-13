import {
  Controller, Get, Post, Put, Body, Param, Query, UseGuards, Request,
} from '@nestjs/common';
import { PrayersService } from './prayer.service';
import { CreatePrayerDto } from './dto/create-prayer.dto';
import { UpdatePrayerDto } from './dto/update-prayer.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('prayer')
export class PrayersController {
  constructor(private readonly prayersService: PrayersService) {}

  @Get()
  findAll(@Query('page') page = 1, @Query('limit') limit = 20, @Query('category') category?: string, @Query('answered') answered?: string) {
    const answeredBool = answered === 'true' ? true : answered === 'false' ? false : undefined;
    return this.prayersService.findAll(+page, +limit, category, answeredBool);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.prayersService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() dto: CreatePrayerDto, @Request() req) {
    return this.prayersService.create(req.user.id, dto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() dto: UpdatePrayerDto) {
    return this.prayersService.update(id, dto);
  }

  @Post(':id/pray')
  @UseGuards(JwtAuthGuard)
  pray(@Param('id') id: string, @Request() req) {
    return this.prayersService.pray(id, req.user.id);
  }
}
