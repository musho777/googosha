import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";


export class PaymentDto {
    @ApiProperty({
        example: '10',
    })
    @IsNumber()
    @IsNotEmpty()
    amount: number
    @ApiProperty({
        example: '1',
    })
    @IsNumber()
    @IsNotEmpty()
    userId: number
}