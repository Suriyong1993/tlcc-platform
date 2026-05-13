import {
  Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { CreateArticleCommentDto } from './dto/create-comment.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Get()
  findAll(@Query('page') page = 1, @Query('limit') limit = 20, @Query('tag') tag?: string) {
    return this.articlesService.findAll(+page, +limit, tag);
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.articlesService.findOne(slug);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.MODERATOR)
  create(@Body() dto: CreateArticleDto, @Request() req) {
    return this.articlesService.create(dto, req.user.id);
  }

  @Put(':slug')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.MODERATOR)
  update(@Param('slug') slug: string, @Body() dto: UpdateArticleDto) {
    return this.articlesService.update(slug, dto);
  }

  @Delete(':slug')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  remove(@Param('slug') slug: string) {
    return this.articlesService.remove(slug);
  }

  @Post(':slug/comments')
  @UseGuards(JwtAuthGuard)
  addComment(@Param('slug') slug: string, @Body() dto: CreateArticleCommentDto, @Request() req) {
    return this.articlesService.addComment(slug, req.user.id, dto);
  }
}
