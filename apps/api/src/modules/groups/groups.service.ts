import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { AddMemberDto } from './dto/add-member.dto';

@Injectable()
export class GroupsService {
  constructor(private prisma: PrismaService) {}

  async findAll(page = 1, limit = 20, category?: string) {
    const skip = (page - 1) * limit;
    const where: any = { isActive: true };
    if (category) where.category = category;
    const [data, total] = await Promise.all([
      this.prisma.group.findMany({
        where, skip, take: limit, orderBy: { name: 'asc' },
        include: { members: { take: 5, include: { user: { select: { id: true, username: true, avatarUrl: true } } } } },
      }),
      this.prisma.group.count({ where }),
    ]);
    return { data, meta: { total, page, limit } };
  }

  async findOne(id: string) {
    const group = await this.prisma.group.findUnique({
      where: { id },
      include: { members: { include: { user: { select: { id: true, username: true, avatarUrl: true } } } } },
    });
    if (!group) throw new NotFoundException('ไม่พบกลุ่ม');
    return group;
  }

  async create(dto: CreateGroupDto) {
    return this.prisma.group.create({ data: dto });
  }

  async update(id: string, dto: UpdateGroupDto) {
    await this.findOne(id);
    return this.prisma.group.update({ where: { id }, data: dto });
  }

  async addMember(groupId: string, dto: AddMemberDto) {
    const group = await this.prisma.group.findUnique({ where: { id: groupId } });
    if (!group) throw new NotFoundException('ไม่พบกลุ่ม');
    try {
      return this.prisma.groupMember.create({ data: { groupId, userId: dto.userId, role: dto.role ?? 'MEMBER' } });
    } catch {
      throw new BadRequestException('ผู้ใช้นี้อยู่ในกลุ่มนี้แล้ว');
    }
  }

  async removeMember(groupId: string, userId: string) {
    return this.prisma.groupMember.delete({
      where: { userId_groupId: { userId, groupId } },
    });
  }
}
