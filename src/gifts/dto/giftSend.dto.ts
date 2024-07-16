import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsNumber, IsString } from "class-validator"

export class GiftSend {

  @ApiProperty({
    example: '10',
  })
  @IsNumber()
  @IsNotEmpty()
  giftId: number


  @ApiProperty({
    example: '10',
  })
  @IsNumber()
  @IsNotEmpty()
  userToId: number

}