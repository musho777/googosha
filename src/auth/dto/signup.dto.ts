import { ApiParam, ApiProperty } from "@nestjs/swagger"
import { IsArray, IsBoolean, IsEmail, IsOptional } from "class-validator"
import { IsNotEmpty, IsString } from "class-validator"

export class SignupDto {
    @ApiProperty({
        example: 'Jon@gmail.com',
        description: 'The email of the owner', required: true
    })
    @IsString()
    @IsNotEmpty()
    email: string

    @ApiProperty({
        example: '******',
    })
    @IsString()
    @IsNotEmpty()
    password: string

    @ApiProperty({
        example: 'Jon'
    })
    @IsString()
    @IsNotEmpty()
    fullName: string

    @ApiProperty({
        example: '+788888888888',
        required: false

    })
    @IsString()
    @IsOptional()
    phone: string

    @ApiProperty({
        example: 'city',
        required: false

    })
    @IsString()
    @IsOptional()
    city: string

    @ApiProperty({
        example: '[Дружба и общение",Отношения,Переписка]',
        required: false

    })
    @IsArray()
    @IsOptional()
    pointOfDate: string[]

    @ApiProperty({
        example: 'Холост',
        required: false

    })
    @IsString()
    @IsOptional()
    familyStatus: string

    @ApiProperty({
        example: 'info',
        required: false

    })
    @IsString()
    @IsOptional()
    info: string

    @ApiProperty({
        example: '41.0018754',
        required: false

    })
    @IsString()
    @IsOptional()
    lat: string

    @ApiProperty({
        example: '71.6590362',
        required: false

    })
    @IsString()
    @IsOptional()
    lon: string

    @ApiProperty({
        example: 'no',
        required: false

    })
    @IsString()
    @IsOptional()
    children: string

    @ApiProperty({
        example: 'boolean',
        required: false

    })
    @IsBoolean()
    @IsOptional()
    sex: boolean

    @ApiProperty({
        example: '23',
        required: false
    })
    @IsString()
    @IsOptional()
    age: string
}