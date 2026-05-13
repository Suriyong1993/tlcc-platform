import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getDashboard() {
    const [users, events, reports, prayers, payments] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.event.count({ where: { isActive: true } }),
      this.prisma.report.count({ where: { isPublished: true } }),
      this.prisma.prayerRequest.count(),
      this.prisma.payment.aggregate({ _sum: { amount: true }, where: { status: 'PAID' } }),
    ]);
    return { users, events, reports, prayers, revenue: payments._sum.amount };
  }

  async getMemberStats() {
    const [total, byRole, activeThisMonth] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.groupBy({ by: ['role'], _count: true }),
      this.prisma.user.count({ where: { updatedAt: { gte: new Date(new Date().setDate(1)) } } }),
    ]);
    return { total, byRole, activeThisMonth };
  }
}
