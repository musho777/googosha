import { Controller, Get, UseGuards, Req, Post, UseInterceptors, UploadedFile, Res, Body, ParseIntPipe, Patch, Delete } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { FileInterceptor } from "@nestjs/platform-express/multer";
import { diskStorage } from 'multer'
import { Param } from "@nestjs/common/decorators";
import { UserService } from './user.service';

@Controller('users')
@UseGuards(JwtGuard)
export class UserController {
    constructor(private userService: UserService) {
        
    }
    
    @Get('me')
    getMe(@GetUser() user: User) {
        return user
    }

    @Get('gifts')
    getGifts(@GetUser('id') id: number) {
        return this.userService.getGifts(id)
    }

    @Get('cities')
    getCities() {
        return this.userService.getCities()
    }

    @Post('giveVipStatus')
    giveVipStatus(@Body() dto: { daysCount: number, email: string }) {
        return this.userService.giveVipStatus(dto.email, dto.daysCount)
    }

    @Post('ban')
    banUser(@Body() dto: { userId: number, daysCount: number }) {
        return this.userService.banUser(dto.userId, dto.daysCount)
    }

    @Post('changeVipCost')
    changeVipCost(@Body() dto: { type: string, amount: number }) {
        return this.userService.changeVipCost(dto.type, dto.amount)
    }

    @Get('vipCost')
    getVipCost(@Body() dto: { type: string, amount: number }) {
        return this.userService.getVipCost(dto.type, dto.amount)
    }

    @Post('deleteVipStatus')
    deleteVipStatus(@Body() dto: { userId: number }) {
        return this.userService.deleteVipStatus(dto.userId)
    }

    @Post('buyVipStatus')
    buyVipStatus(@Body() dto: { type: string }, @GetUser('id') id: number) {
        return this.userService.buyVipStatusWithCoins(id, dto.type)
    }

    @Delete(':id')
    deleteUser(@Param('id', ParseIntPipe) userId: number) {
        console.log(userId)
        return this.userService.deleteUser(userId)
    }

    
    @Post('uploadAvatar')
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
    uploadFile(@UploadedFile() file, @GetUser('id') id: number) {
        console.log(file)
        return this.userService.uploadAvatar(id, file.filename)
    }

    @Post('uploadToGallery')
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
    uploadGalleryFile(@UploadedFile() file, @GetUser('id') id: number) {
        console.log(file)
        return this.userService.uploadToGallery(id, file.filename)
    }

    @Patch('')
    updateUser(@GetUser('id') id: number, @Body() dto: any) {
        return this.userService.updateUser(id, dto)
    }

    @Delete('')
    deleteMe(@GetUser('id') id: number) {
        return this.userService.deleteUser(id)
    }

    @Get('')
    getUsers() {
        return this.userService.getUsers()
    }
}
