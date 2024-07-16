import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsNumber, IsString } from "class-validator"

export class Gifts {
  @ApiProperty({
    example: 'type',
  })
  @IsString()
  @IsNotEmpty()
  name: string
  @ApiProperty({
    example: '10',
  })
  @IsNumber()
  @IsNotEmpty()
  cost: number
}