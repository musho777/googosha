import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString } from "class-validator"

export class RecoverPasswordSecondStep {
  @ApiProperty({
    example: 'Jon@gmail.com',
  })
  @IsString()
  @IsNotEmpty()
  email: string
  @ApiProperty({
    example: 'code'
  })
  @IsString()
  @IsNotEmpty()
  code: string

  @ApiProperty({
    example: '******',
  })
  @IsString()
  @IsNotEmpty()
  password: string
}