import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsNumber, IsString } from "class-validator"

export class CreateComplaint {
  @ApiProperty({
    example: 'text',
  })
  @IsString()
  @IsNotEmpty()
  reason: string
  @ApiProperty({
    example: '10',
  })
  @IsNumber()
  @IsNotEmpty()
  messageId: number
}