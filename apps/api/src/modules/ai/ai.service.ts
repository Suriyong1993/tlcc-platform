import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';

@Injectable()
export class AiService {
  constructor(private prisma: PrismaService) {}

  async chat(userId: string, prompt: string, model?: string) {
    const start = Date.now();
    // Placeholder: call OpenRouter API here
    // For now, just log the request
    const result = { response: 'AI chat endpoint ready — connect OpenRouter API key' };
    const ms = Date.now() - start;

    await this.prisma.aIRequest.create({
      data: { userId, prompt, model, response: result.response, inputTokens: 0, outputTokens: 0, cost: 0 },
    });
    return { ...result, processingMs: ms };
  }

  async getHistory(userId: string, limit = 20) {
    return this.prisma.aIRequest.findMany({
      where: { userId }, orderBy: { createdAt: 'desc' }, take: limit,
    });
  }
}
