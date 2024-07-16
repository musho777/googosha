import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";


export class GiveCoins {
  @ApiProperty({
    example: '10',
  })
  @IsNumber()
  @IsNotEmpty()
  amount: number
  @ApiProperty({
    example: 'Jon@gmail.com',
  })
  @IsString()
  @IsNotEmpty()
  email: string
}