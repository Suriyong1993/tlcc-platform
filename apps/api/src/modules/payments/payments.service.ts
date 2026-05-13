import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId?: string, page = 1, limit = 20, status?: string) {
    const skip = (page - 1) * limit;
    const where: any = {};
    if (userId) where.userId = userId;
    if (status) where.status = status;
    const [data, total] = await Promise.all([
      this.prisma.payment.findMany({
        where, skip, take: limit, orderBy: { createdAt: 'desc' },
        include: { user: { select: { id: true, username: true, profile: true } } },
      }),
      this.prisma.payment.count({ where }),
    ]);
    return { data, meta: { total, page, limit } };
  }

  async findOne(id: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { id },
      include: { user: { select: { id: true, username: true, profile: true } } },
    });
    if (!payment) throw new NotFoundException('ไม่พบรายการชำระเงิน');
    return payment;
  }

  async create(userId: string, dto: CreatePaymentDto) {
    return this.prisma.payment.create({ data: { ...dto, userId } });
  }

  async update(id: string, dto: UpdatePaymentDto) {
    await this.findOne(id);
    return this.prisma.payment.update({ where: { id }, data: dto });
  }

  async getSummary(userId?: string) {
    const where: any = { status: 'PAID' };
    if (userId) where.userId = userId;
    const result = await this.prisma.payment.aggregate({
      _sum: { amount: true },
      _count: true,
      where,
    });
    return { totalAmount: result._sum.amount, count: result._count };
  }
}
