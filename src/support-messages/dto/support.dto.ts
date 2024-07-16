import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsNumber, IsString } from "class-validator"

export class Support {
  @ApiProperty({
    example: 'text',
  })
  @IsString()
  @IsNotEmpty()
  text: string
  @ApiProperty({
    example: '10',
  })
  @IsNumber()
  @IsNotEmpty()
  userToId: number
}