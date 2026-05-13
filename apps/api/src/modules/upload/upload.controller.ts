import {
  Controller, Post, UseGuards, UseInterceptors, UploadedFile, Request,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { UploadService } from './upload.service';
import { extname } from 'path';

const ALLOWED = ['.jpg', '.jpeg', '.png', '.gif', '.pdf', '.doc', '.docx', '.mp3', '.mp4', '.webp'];

@Controller('upload')
@UseGuards(JwtAuthGuard)
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Request() req) {
    if (!file) throw new BadRequestException('ไม่มีไฟล์');
    const ext = extname(file.originalname).toLowerCase();
    if (!ALLOWED.includes(ext)) throw new BadRequestException('ไม่รองรับไฟล์ชนิดนี้');

    const url = `/uploads/${file.filename}`;
    const attachment = await this.uploadService.recordFile(
      req.user.id, file.originalname, url, file.mimetype, file.size,
    );
    return { url, attachment };
  }
}
