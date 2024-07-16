import { ApiProperty } from "@nestjs/swagger"
import { IsArray, IsBoolean, IsEmail, IsOptional } from "class-validator"
import { IsNotEmpty, IsString } from "class-validator"

export class SigninDto {
    @ApiProperty({
        example: 'Jon@gmail.com',
    })
    @IsEmail()
    @IsNotEmpty()
    email: string
    @ApiProperty({
        example: '******',
    })
    @IsString()
    @IsNotEmpty()
    password: string
}