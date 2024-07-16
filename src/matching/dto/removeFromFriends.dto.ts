import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsNumber, IsString } from "class-validator"

export class RemoveFromFriends {
  @ApiProperty({
    example: '1',
  })
  @IsNumber()
  @IsNotEmpty()
  id: number
}