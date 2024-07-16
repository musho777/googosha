import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString } from "class-validator"

export class User {
  @ApiProperty({
    example: 'text',
  })
  @IsString()
  @IsNotEmpty()
  text: string
}