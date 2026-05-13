import {
  Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request,
} from '@nestjs/common';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get()
  findAll(@Query('page') page = 1, @Query('limit') limit = 20, @Query('category') category?: string) {
    return this.reportsService.findAll(+page, +limit, category);
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  myReports(@Request() req, @Query('page') page = 1, @Query('limit') limit = 20) {
    return this.reportsService.findAll(+page, +limit, undefined, false);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reportsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() dto: CreateReportDto, @Request() req) {
    return this.reportsService.create(req.user.id, dto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() dto: UpdateReportDto, @Request() req) {
    return this.reportsService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.reportsService.remove(id);
  }

  @Post(':id/like')
  like(@Param('id') id: string) {
    return this.reportsService.like(id);
  }
}
