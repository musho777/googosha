import { Controller, Get, UseGuards, Post, Body, UseInterceptors, UploadedFile, Param, ParseIntPipe } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';
import { SupportMessagesService } from './support-messages.service';
import { FileInterceptor } from "@nestjs/platform-express/multer";
import { diskStorage } from 'multer'
import { GetUser } from 'src/auth/decorator';

@UseGuards(JwtGuard)
@Controller('support-messages')
export class SupportMessagesController {
  constructor(private readonly supportMessagesService: SupportMessagesService) {}

  @Get('chats')
  getUsersMessagesByChats() {
    return this.supportMessagesService.getUsersMessagesByChats()
  }

  @Post('user')
  createUserMessage(@GetUser('id') userId: number, @Body() dto: { text: string }) {
    return this.supportMessagesService.createUserMessage(userId, dto.text)
  }

  @Post('support')
  createSupportMessage(@Body() dto: { text: string, userToId: number }) {
    return this.supportMessagesService.createSupportMessage(dto.userToId, dto.text)
  }

  @Get('')
  getUserMessages(@GetUser('id') userId: number) {
    return this.supportMessagesService.getUserMessages(userId)
  }

}
