import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { CreateChatRoomDto } from './dto/create-room.dto';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async getRooms(userId: string) {
    return this.prisma.chatRoom.findMany({
      where: { members: { some: { userId } }, isActive: true },
      orderBy: { updatedAt: 'desc' },
      include: { members: { include: { user: { select: { id: true, username: true, avatarUrl: true } } } } },
    });
  }

  async createRoom(userId: string, dto: CreateChatRoomDto) {
    const room = await this.prisma.chatRoom.create({
      data: {
        name: dto.name,
        type: dto.type,
        imageUrl: dto.imageUrl,
        members: { create: [{ userId }, ...dto.memberIds.filter((id) => id !== userId).map((id) => ({ userId: id }))] },
      },
      include: { members: { include: { user: { select: { id: true, username: true } } } } },
    });
    return room;
  }

  async getMessages(chatRoomId: string, userId: string, page = 1, limit = 50) {
    const member = await this.prisma.chatRoomMember.findUnique({
      where: { chatRoomId_userId: { chatRoomId, userId } },
    });
    if (!member) throw new ForbiddenException('คุณไม่ได้อยู่ในห้องนี้');

    const skip = (page - 1) * limit;
    const messages = await this.prisma.message.findMany({
      where: { chatRoomId },
      skip, take: limit, orderBy: { createdAt: 'desc' },
      include: { sender: { select: { id: true, username: true, avatarUrl: true } } },
    });
    return { data: messages.reverse(), meta: { page, limit } };
  }

  async sendMessage(userId: string, dto: CreateMessageDto) {
    const member = await this.prisma.chatRoomMember.findUnique({
      where: { chatRoomId_userId: { chatRoomId: dto.chatRoomId, userId } },
    });
    if (!member) throw new ForbiddenException('คุณไม่ได้อยู่ในห้องนี้');

    const message = await this.prisma.message.create({
      data: { chatRoomId: dto.chatRoomId, senderId: userId, content: dto.content, type: dto.type, imageUrl: dto.imageUrl },
      include: { sender: { select: { id: true, username: true, avatarUrl: true } } },
    });

    await this.prisma.chatRoom.update({ where: { id: dto.chatRoomId }, data: { updatedAt: new Date() } });
    return message;
  }
}
