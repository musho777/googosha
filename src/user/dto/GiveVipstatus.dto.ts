import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsNumber, IsString } from "class-validator"

export class GiveVipstatus {
  @ApiProperty({
    example: 'exampe@gmai.com',
  })
  @IsString()
  @IsNotEmpty()
  email: string


  @ApiProperty({
    example: '10',
  })
  @IsNumber()
  @IsNotEmpty()
  daysCount: number
}