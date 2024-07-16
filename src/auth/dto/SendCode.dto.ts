import { ApiParam, ApiProperty } from "@nestjs/swagger"
import { IsArray, IsBoolean, IsEmail, IsOptional } from "class-validator"
import { IsNotEmpty, IsString } from "class-validator"

export class SendCode {
  @ApiProperty({
    example: 'code',
  })
  @IsString()
  @IsNotEmpty()
  code: string
}