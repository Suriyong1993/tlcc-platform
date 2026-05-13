import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  async findAll(page = 1, limit = 20, category?: string) {
    const skip = (page - 1) * limit;
    const where: any = { isActive: true };
    if (category) where.category = category;
    const [data, total] = await Promise.all([
      this.prisma.event.findMany({
        where, skip, take: limit, orderBy: { startDate: 'asc' },
        include: { registrations: { select: { id: true, userId: true, guestCount: true, status: true } } },
      }),
      this.prisma.event.count({ where }),
    ]);
    return { data, meta: { total, page, limit } };
  }

  async findOne(id: string) {
    const event = await this.prisma.event.findUnique({
      where: { id, isActive: true },
      include: { registrations: { include: { user: { select: { id: true, username: true, profile: true } } } } },
    });
    if (!event) throw new NotFoundException('ไม่พบกิจกรรม');
    return event;
  }

  async register(userId: string, eventId: string, guestCount = 1, note?: string) {
    const event = await this.prisma.event.findUnique({ where: { id: eventId } });
    if (!event) throw new NotFoundException('ไม่พบกิจกรรม');
    if (event.maxCapacity && event.currentRegistrations + guestCount > event.maxCapacity)
      throw new BadRequestException('กิจกรรมนี้เต็มแล้ว');
    try {
      const reg = await this.prisma.eventRegistration.create({
        data: { userId, eventId, guestCount, note },
      });
      await this.prisma.event.update({
        where: { id: eventId },
        data: { currentRegistrations: { increment: guestCount } },
      });
      return reg;
    } catch {
      throw new BadRequestException('คุณลงทะเบียนกิจกรรมนี้ไปแล้ว');
    }
  }

  async create(dto: CreateEventDto) {
    return this.prisma.event.create({ data: dto });
  }

  async update(id: string, dto: UpdateEventDto) {
    await this.findOne(id);
    return this.prisma.event.update({ where: { id }, data: dto });
  }
}
