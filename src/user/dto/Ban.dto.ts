import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsNumber, IsString } from "class-validator"

export class Ban {
  @ApiProperty({
    example: '1',
  })
  @IsNumber()
  @IsNotEmpty()
  userId: number


  @ApiProperty({
    example: '10',
  })
  @IsNumber()
  @IsNotEmpty()
  daysCount: number
}