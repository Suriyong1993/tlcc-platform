import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';

@Injectable()
export class UploadService {
  constructor(private prisma: PrismaService) {}

  async recordFile(userId: string, fileName: string, url: string, mimeType: string, fileSize: number, articleId?: string, sermonId?: string) {
    return this.prisma.attachment.create({
      data: { uploaderId: userId, fileName, url, mimeType, fileSize, articleId, sermonId },
    });
  }

  async getFilesByUser(userId: string) {
    return this.prisma.attachment.findMany({ where: { uploaderId: userId }, orderBy: { createdAt: 'desc' } });
  }
}
