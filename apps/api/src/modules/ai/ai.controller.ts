import { Controller, Post, Body, Get, UseGuards, Req, Query } from '@nestjs/common';
import { AiService } from './ai.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('ai')
@UseGuards(JwtAuthGuard)
export class AiController {
  constructor(private aiService: AiService) {}

  @Post('chat')
  chat(@Req() req: any, @Body() body: { prompt: string; model?: string }) {
    return this.aiService.chat(req.user.id, body.prompt, body.model);
  }

  @Get('history')
  history(@Req() req: any, @Query('limit') l = 20) {
    return this.aiService.getHistory(req.user.id, Number(l));
  }
}
