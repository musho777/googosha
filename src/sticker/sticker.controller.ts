import { StickerService } from './sticker.service';
import { Controller, Get, UseGuards, Post, Body, UseInterceptors, UploadedFile, Param, ParseIntPipe } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';
import { FileInterceptor } from "@nestjs/platform-express/multer";
import { diskStorage } from 'multer'
import { GetUser } from 'src/auth/decorator';

@Controller('sticker')
@UseGuards(JwtGuard)
export class StickerController {
  constructor(private readonly stickerService: StickerService) {}

  @Get()
  getStickers() {
    return this.stickerService.getStickers()
  }

  @Post()
  createSticker(@Body() dto: { name: string, cost: number }) {
    return this.stickerService.createSticker(dto)
  }
  @Post('uploadStickerImage/:id')
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './uploads',
            filename: (req, file, cb) => {
                const name = file.originalname.split('.')[0]
                const extension = file.originalname.split('.')[1]
                const newFileName = name.split(" ").join('_')+'_'+Date.now()+'.'+extension

                cb(null, newFileName)
            }
        })
    }))
    uploadFile(@UploadedFile() file, @Param('id', ParseIntPipe) stickerId: number) {
        console.log(file)
        return this.stickerService.uploadStickerImage(stickerId, file.filename)
    }

  @Get('my')
  getMyStickers(@GetUser('id') userId: number) {
    return this.stickerService.getUserStickers(userId)
  }

  @Get('available')
  getAvailableStickers(@GetUser('id') userId: number) {
    return this.stickerService.getUserAvailableStickers(userId)
  }

  @Post('buy')
  buySticker(@GetUser('id') userId: number, @Body() dto: { id: number }) {
    return this.stickerService.buySticker(dto.id, userId)
  }
}
