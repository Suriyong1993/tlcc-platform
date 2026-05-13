import {
  Controller, Get, Post, Body, Param, Query, UseGuards, Request,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { CreateChatRoomDto } from './dto/create-room.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('rooms')
  getRooms(@Request() req) {
    return this.chatService.getRooms(req.user.id);
  }

  @Post('rooms')
  createRoom(@Body() dto: CreateChatRoomDto, @Request() req) {
    return this.chatService.createRoom(req.user.id, dto);
  }

  @Get('rooms/:id/messages')
  getMessages(@Param('id') id: string, @Request() req, @Query('page') page = 1, @Query('limit') limit = 50) {
    return this.chatService.getMessages(id, req.user.id, +page, +limit);
  }

  @Post('messages')
  sendMessage(@Body() dto: CreateMessageDto, @Request() req) {
    return this.chatService.sendMessage(req.user.id, dto);
  }
}
