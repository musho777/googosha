import { Controller, Get, UseGuards, Post, Body, UseInterceptors, UploadedFile, Param, ParseIntPipe } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';
import { NotificationsService } from './notifications.service';
import { FileInterceptor } from "@nestjs/platform-express/multer";
import { diskStorage } from 'multer'
import { GetUser } from 'src/auth/decorator';

@UseGuards(JwtGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  getNotifications(@GetUser('id') userId: number) {
    return this.notificationsService.getNotifications(userId)
  }
}
