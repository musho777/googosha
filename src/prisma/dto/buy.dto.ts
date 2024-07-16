import { ApiProperty } from "@nestjs/swagger"
import { IsArray, IsBoolean, IsEmail, IsNumber, IsOptional } from "class-validator"
import { IsNotEmpty, IsString } from "class-validator"

export class Buy {

  @ApiProperty({
    example: 1
  })
  @IsNumber()
  @IsNotEmpty()
  id: number
}