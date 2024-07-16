import { Controller, Get, UseGuards, Post, Body, UseInterceptors, UploadedFile, Param, ParseIntPipe } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';
import { GiftsService } from './gifts.service';
import { FileInterceptor } from "@nestjs/platform-express/multer";
import { diskStorage } from 'multer'
import { GetUser } from 'src/auth/decorator';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Gifts } from './dto/gifts.dto';
import { GiftSend } from './dto/giftSend.dto';

@ApiTags('Gifts')
@UseGuards(JwtGuard)
@Controller('gifts')
export class GiftsController {
  constructor(private readonly giftsService: GiftsService) { }

  @Get()
  getGifts() {
    return this.giftsService.getGifts()
  }

  @Post()
  @ApiResponse({
    status: 200, description: 'success'
  })
  createGift(@Body() dto: Gifts) {
    return this.giftsService.createGift(dto)
  }
  @Post('uploadGiftImage/:id')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const name = file.originalname.split('.')[0]
        const extension = file.originalname.split('.')[1]
        const newFileName = name.split(" ").join('_') + '_' + Date.now() + '.' + extension

        cb(null, newFileName)
      }
    })
  }))
  uploadFile(@UploadedFile() file, @Param('id', ParseIntPipe) giftId: number) {
    return this.giftsService.uploadGiftImage(giftId, file.filename)
  }

  @ApiResponse({
    status: 401, description: 'User already has this gift'
  })
  @ApiResponse({
    status: 400, description: 'Not enough money'
  })
  @ApiResponse({
    status: 200, description: 'success'
  })
  @Post('send')
  sendGift(@Body() dto: GiftSend, @GetUser('id') userId: number) {
    return this.giftsService.sendGift(dto.giftId, userId, dto.userToId)
  }
}
