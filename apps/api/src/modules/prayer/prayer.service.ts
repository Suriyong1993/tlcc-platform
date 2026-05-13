import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { CreatePrayerDto } from './dto/create-prayer.dto';
import { UpdatePrayerDto } from './dto/update-prayer.dto';

@Injectable()
export class PrayersService {
  constructor(private prisma: PrismaService) {}

  async findAll(page = 1, limit = 20, category?: string, answered?: boolean) {
    const skip = (page - 1) * limit;
    const where: any = { isPublic: true };
    if (category) where.category = category;
    if (answered !== undefined) where.isAnswered = answered;
    const [data, total] = await Promise.all([
      this.prisma.prayerRequest.findMany({
        where, skip, take: limit, orderBy: { createdAt: 'desc' },
        include: { user: { select: { id: true, username: true } }, _count: { select: { prayers: true } } },
      }),
      this.prisma.prayerRequest.count({ where }),
    ]);
    return { data, meta: { total, page, limit } };
  }

  async findOne(id: string) {
    const prayer = await this.prisma.prayerRequest.findUnique({
      where: { id },
      include: { user: { select: { id: true, username: true } }, prayers: { take: 1 } },
    });
    if (!prayer) throw new NotFoundException('ไม่พบคำขออธิษฐาน');
    return prayer;
  }

  async create(userId: string, dto: CreatePrayerDto) {
    return this.prisma.prayerRequest.create({
      data: { ...dto, userId },
    });
  }

  async update(id: string, dto: UpdatePrayerDto) {
    await this.findOne(id);
    return this.prisma.prayerRequest.update({ where: { id }, data: dto });
  }

  async markAnswered(id: string) {
    return this.prisma.prayerRequest.update({
      where: { id },
      data: { isAnswered: true },
    });
  }

  async pray(requestId: string, userId: string) {
    try {
      await this.prisma.prayer.create({ data: { requestId, userId } });
      return this.prisma.prayerRequest.update({
        where: { id: requestId },
        data: { prayCount: { increment: 1 } },
      });
    } catch {
      // already prayed
      return this.prisma.prayerRequest.findUnique({ where: { id: requestId } });
    }
  }
}
