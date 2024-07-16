import { Controller, Get, Post, UseGuards, ParseIntPipe, Param, Body } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Chat } from './dto/chat.dto';

@ApiTags('Messages')
@UseGuards(JwtGuard)
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) { }

  @Get('chat')
  @ApiResponse({
    status: 200, description: 'success'
  })
  getChats(@GetUser('id', ParseIntPipe) userId: number) {
    return this.messagesService.getChats(userId)
  }

  @Get('messages/:id')
  @ApiResponse({
    status: 200, description: 'success'
  })
  getMessages(@Param('id', ParseIntPipe) chatId: number, @GetUser('id', ParseIntPipe) userId: number) {
    return this.messagesService.getMessages(chatId, userId)
  }

  @Post('chat')

  @ApiResponse({
    status: 200, description: 'success'
  })
  createChat(@GetUser('id', ParseIntPipe) user1Id: number, @Body() dto: Chat) {
    return this.messagesService.createChat(user1Id, dto.id)
  }

}
