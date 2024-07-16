import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsNumber, IsString } from "class-validator"

export class DeleteVipStatus {
  @ApiProperty({
    example: '10',
  })
  @IsNumber()
  @IsNotEmpty()
  userId: number
}