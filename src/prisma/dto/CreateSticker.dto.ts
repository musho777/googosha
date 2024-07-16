import { ApiProperty } from "@nestjs/swagger"
import { IsArray, IsBoolean, IsEmail, IsNumber, IsOptional } from "class-validator"
import { IsNotEmpty, IsString } from "class-validator"

export class CreateSticker {
  @ApiProperty({
    example: 'name',
  })
  @IsEmail()
  @IsNotEmpty()
  name: string
  @ApiProperty({
    example: 10
  })
  @IsNumber()
  @IsNotEmpty()
  cost: number
}