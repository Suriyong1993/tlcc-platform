import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { CreateArticleCommentDto } from './dto/create-comment.dto';

@Injectable()
export class ArticlesService {
  constructor(private prisma: PrismaService) {}

  async findAll(page = 1, limit = 20, tag?: string) {
    const skip = (page - 1) * limit;
    const where: any = {};
    if (tag) where.tags = { has: tag };
    const [data, total] = await Promise.all([
      this.prisma.article.findMany({
        where, skip, take: limit, orderBy: { publishedAt: 'desc' },
        include: { author: { select: { id: true, username: true, profile: true } } },
      }),
      this.prisma.article.count({ where }),
    ]);
    return { data, meta: { total, page, limit } };
  }

  async findOne(slug: string) {
    const article = await this.prisma.article.findUnique({
      where: { slug },
      include: {
        author: { select: { id: true, username: true, profile: true } },
        commentsArr: {
          include: { user: { select: { id: true, username: true } } },
          orderBy: { createdAt: 'asc' },
        },
      },
    });
    if (!article) throw new NotFoundException('ไม่พบบทความ');
    await this.prisma.article.update({ where: { slug }, data: { views: { increment: 1 } } });
    return article;
  }

  async create(dto: CreateArticleDto, authorId: string) {
    return this.prisma.article.create({ data: { ...dto, authorId } });
  }

  async update(slug: string, dto: UpdateArticleDto) {
    const existing = await this.prisma.article.findUnique({ where: { slug } });
    if (!existing) throw new NotFoundException('ไม่พบบทความ');
    return this.prisma.article.update({ where: { slug }, data: dto });
  }

  async remove(slug: string) {
    const existing = await this.prisma.article.findUnique({ where: { slug } });
    if (!existing) throw new NotFoundException('ไม่พบบทความ');
    return this.prisma.article.delete({ where: { slug } });
  }

  async addComment(slug: string, userId: string, dto: CreateArticleCommentDto) {
    const article = await this.prisma.article.findUnique({ where: { slug } });
    if (!article) throw new NotFoundException('ไม่พบบทความ');
    const comment = await this.prisma.articleComment.create({
      data: { articleId: article.id, userId, content: dto.content },
    });
    await this.prisma.article.update({ where: { slug }, data: { comments: { increment: 1 } } });
    return comment;
  }
}
