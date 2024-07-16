import { Controller, Post, Body, HttpCode, UseInterceptors, UploadedFile, Res, Get, Ip } from "@nestjs/common";
import { HttpStatus } from "@nestjs/common/enums";
import { FileInterceptor } from "@nestjs/platform-express/multer";
import { AuthService } from "./auth.service";
import { SigninDto, SignupDto } from "./dto";
import { diskStorage } from 'multer'
import { Param } from "@nestjs/common/decorators";
import { GetUser } from "./decorator";
import { ApiBadRequestResponse, ApiCreatedResponse, ApiProperty, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ReqoverDto } from "./dto/reqover.dto";
import { RecoverPasswordSecondStep } from "./dto/recoverPasswordSecondStep.dto";
import { SendCode } from "./dto/SendCode.dto";


@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {

    }

    @ApiCreatedResponse({
        description: "User created successfully",
        example: {
            'access_token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjMzLCJlbWFpbCI6IkpvbjNAZ21haWwuY29tIiwiaWF0IjoxNzIxMTI5ODI3LCJleHAiOjE3MjEzODkwMjd9.3d-9ToAfgm9h3rRUfIPBgavvauzVHrSKV8Qf8Ip1SiQ'
        }
    })
    @ApiResponse({
        status: 400, example: {
            "error": "Bad Request"
        }
    })
    @Post('signup')
    signup(@Body() dto: SignupDto) {
        return this.authService.signup(dto)
    }





    @Post('recover')
    @ApiResponse({
        status: 200, description: 'success'
    })
    @ApiResponse({
        status: 403, example: {
            "message": "Email doesn't exist",
            "error": "Forbidden"
        }
    })
    recoverPassword(@Body() dto: ReqoverDto) {
        return this.authService.recoverPassword(dto.email)
    }







    @ApiResponse({
        status: 403, example: {
            "message": "Credentials incorrect",
            "error": "Forbidden"
        }
    })
    @ApiResponse({
        status: 400, example: {
            "message": "Code is incorrect",
            "error": "Forbidden"
        }
    })
    @ApiResponse({
        status: 200,
        example: {
            'access_token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjMzLCJlbWFpbCI6IkpvbjNAZ21haWwuY29tIiwiaWF0IjoxNzIxMTI5ODI3LCJleHAiOjE3MjEzODkwMjd9.3d-9ToAfgm9h3rRUfIPBgavvauzVHrSKV8Qf8Ip1SiQ'
        }
    })
    @Post('recoverSecondStep')
    recoverPasswordSecondStep(@Body() dto: RecoverPasswordSecondStep) {
        return this.authService.recoverPasswordSecondStep(dto.code, dto.password, dto.email)
    }





    @ApiResponse({
        status: 403, example: {
            "message": "Code is incorrect",
            "error": "Forbidden"
        }
    })
    @ApiResponse({
        status: 200,
        description: "successfully",
        example: {
            'access_token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjMzLCJlbWFpbCI6IkpvbjNAZ21haWwuY29tIiwiaWF0IjoxNzIxMTI5ODI3LCJleHAiOjE3MjEzODkwMjd9.3d-9ToAfgm9h3rRUfIPBgavvauzVHrSKV8Qf8Ip1SiQ'
        }
    })
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
    @ApiResponse({
        status: 200,
        description: "successfully",
    })
    async sendCode(@Body() dto: SendCode) {
        return this.authService.sendCode(dto.code)
    }
}