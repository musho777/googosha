import { ApiParam, ApiProperty } from "@nestjs/swagger"
import { IsArray, IsBoolean, IsEmail, IsOptional } from "class-validator"
import { IsNotEmpty, IsString } from "class-validator"

export class ReqoverDto {
  @ApiProperty({
    example: 'Jon@gmail.com',
    description: 'The email of the owner', required: true
  })
  @IsString()
  @IsNotEmpty()
  email: string
}