import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsNumber, IsString } from "class-validator"

export class ChangeVipCost {
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