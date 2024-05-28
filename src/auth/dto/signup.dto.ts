import { IsArray, IsBoolean, IsEmail, IsOptional } from "class-validator"
import { IsNotEmpty, IsString } from "class-validator"

export class SignupDto {
    @IsString()
    @IsNotEmpty()
    email: string

    @IsString()
    @IsNotEmpty()
    password: string

    @IsString()
    @IsNotEmpty()
    fullName: string

    @IsString()
    @IsOptional()
    phone: string

    @IsString()
    @IsOptional()
    city: string

    @IsArray()
    @IsOptional()
    pointOfDate: string[]

    @IsString()
    @IsOptional()
    familyStatus: string

    @IsString()
    @IsOptional()
    info: string

    @IsString()
    @IsOptional()
    lat: string

    @IsString()
    @IsOptional()
    lon: string

    @IsString()
    @IsOptional()
    children: string

    @IsBoolean()
    @IsOptional()
    sex: boolean

    @IsString()
    @IsOptional()
    age: string
}