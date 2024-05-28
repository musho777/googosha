import { Controller, Post, Body, HttpCode, UseInterceptors, UploadedFile, Res, Get, Ip } from "@nestjs/common";
import { HttpStatus } from "@nestjs/common/enums";
import { FileInterceptor } from "@nestjs/platform-express/multer";
import { AuthService } from "./auth.service";
import { SigninDto, SignupDto } from "./dto";
import { diskStorage } from 'multer'
import { Param } from "@nestjs/common/decorators";
import { GetUser } from "./decorator";

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {

    }

    @Post('signup')
    signup(@Body() dto: SignupDto) {
        return this.authService.signup(dto)
    }

    @Post('recover')
    recoverPassword(@Body() dto: { email: string }) {
        return this.authService.recoverPassword(dto.email)
    }

    @Post('recoverSecondStep')
    recoverPasswordSecondStep(@Body() dto: { email: string, code: string, password: string }) {
        return this.authService.recoverPasswordSecondStep(dto.code, dto.password, dto.email)
    }

    @HttpCode(HttpStatus.OK)
    @Post('signin')
    signin(@Body() dto: SigninDto, @Ip() ip) {
        return this.authService.signin(dto, ip)
    }

    @Get('pictures/:filename')
    async getPicture(@Param('filename') filename, @Res() res) {
        res.sendFile(filename, { root: './uploads' })
    }

    @Post('code')
    async sendCode(@Body() dto: { code: string }) {
        return this.authService.sendCode(dto.code)
    }
}