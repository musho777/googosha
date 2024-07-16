import { Controller, Get, UseGuards, Post, Body, UseInterceptors, UploadedFile, Param, ParseIntPipe } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';
import { SupportMessagesService } from './support-messages.service';
import { FileInterceptor } from "@nestjs/platform-express/multer";
import { diskStorage } from 'multer'
import { GetUser } from 'src/auth/decorator';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from './dto/User.dto';
import { Support } from './dto/support.dto';

@ApiTags('Support-messafes')
@UseGuards(JwtGuard)
@Controller('support-messages')
export class SupportMessagesController {
  constructor(private readonly supportMessagesService: SupportMessagesService) { }

  @Get('chats')
  getUsersMessagesByChats() {
    return this.supportMessagesService.getUsersMessagesByChats()
  }

  @ApiResponse({
    status: 200, description: 'success'
  })
  @Post('user')
  createUserMessage(@GetUser('id') userId: number, @Body() dto: User) {
    return this.supportMessagesService.createUserMessage(userId, dto.text)
  }

  @ApiResponse({
    status: 200, description: 'success'
  })
  @Post('support')
  createSupportMessage(@Body() dto: Support) {
    return this.supportMessagesService.createSupportMessage(dto.userToId, dto.text)
  }

  @Get('')
  getUserMessages(@GetUser('id') userId: number) {
    return this.supportMessagesService.getUserMessages(userId)
  }

}
