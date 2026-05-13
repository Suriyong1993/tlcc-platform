import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { CreateSermonDto } from './dto/create-sermon.dto';
import { UpdateSermonDto } from './dto/update-sermon.dto';

@Injectable()
export class SermonsService {
  constructor(private prisma: PrismaService) {}

  async findAll(page = 1, limit = 20, series?: string) {
    const skip = (page - 1) * limit;
    const where: any = {};
    if (series) where.series = series;
    const [data, total] = await Promise.all([
      this.prisma.sermon.findMany({
        where, skip, take: limit, orderBy: { sermonDate: 'desc' },
        include: { speaker: { select: { id: true, username: true } } },
      }),
      this.prisma.sermon.count({ where }),
    ]);
    return { data, meta: { total, page, limit } };
  }

  async findOne(id: string) {
    const sermon = await this.prisma.sermon.findUnique({
      where: { id },
      include: { speaker: { select: { id: true, username: true, profile: true } } },
    });
    if (!sermon) throw new NotFoundException('ไม่พบคำเทศนา');
    // increment views
    await this.prisma.sermon.update({ where: { id }, data: { views: { increment: 1 } } });
    return sermon;
  }

  async create(dto: CreateSermonDto, speakerId: string) {
    return this.prisma.sermon.create({ data: { ...dto, speakerId } });
  }

  async update(id: string, dto: UpdateSermonDto) {
    await this.findOne(id);
    return this.prisma.sermon.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.sermon.delete({ where: { id } });
  }

  async findBySeries(series: string) {
    return this.prisma.sermon.findMany({
      where: { series },
      orderBy: { sermonDate: 'desc' },
      include: { speaker: { select: { id: true, username: true } } },
    });
  }
}
