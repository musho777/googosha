import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsNumber, IsString } from "class-validator"

export class VipCost {
  @ApiProperty({
    example: 'type',
  })
  @IsString()
  @IsNotEmpty()
  type: string
  @ApiProperty({
    example: '10',
  })
  @IsNumber()
  @IsNotEmpty()
  amount: number
}