import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";


export class CoinCost {
  @ApiProperty({
    example: '10',
  })
  @IsNumber()
  @IsNotEmpty()
  newCost: number
}