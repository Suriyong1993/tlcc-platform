import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async findAll(page = 1, limit = 20, category?: string, publishedOnly = true) {
    const skip = (page - 1) * limit;
    const where: any = {};
    if (publishedOnly) where.isPublished = true;
    if (category) where.category = category;
    const [data, total] = await Promise.all([
      this.prisma.report.findMany({
        where, skip, take: limit, orderBy: { createdAt: 'desc' },
        include: { user: { select: { id: true, username: true, avatarUrl: true } }, reportImages: true },
      }),
      this.prisma.report.count({ where }),
    ]);
    return { data, meta: { total, page, limit } };
  }

  async findOne(id: string) {
    const report = await this.prisma.report.findUnique({
      where: { id },
      include: { user: { select: { id: true, username: true } }, reportImages: true },
    });
    if (!report) throw new NotFoundException('ไม่พบรายงาน');
    return report;
  }

  async create(userId: string, dto: CreateReportDto) {
    return this.prisma.report.create({
      data: { ...dto, userId, publishedAt: dto.isPublished ? new Date() : null },
    });
  }

  async update(id: string, dto: UpdateReportDto) {
    await this.findOne(id);
    if (dto.isPublished) dto.publishedAt = new Date();
    return this.prisma.report.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.report.delete({ where: { id } });
  }

  async like(id: string) {
    return this.prisma.report.update({ where: { id }, data: { likes: { increment: 1 } } });
  }
}
