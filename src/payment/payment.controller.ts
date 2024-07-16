import { Controller, Post, UsePipes, ValidationPipe, Body, Get } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';
import { PaymentDto, PaymentStatusDto } from './dto';
import { PaymentService } from './payment.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CoinCost } from './dto/coinCost.dto';
import { GiveCoins } from './dto/giveCoins.dto';

@ApiTags('Payment')
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) { }

  @Get()
  getPayments() {
    return this.paymentService.getPayments()
  }


  @UsePipes(new ValidationPipe())
  @Post()
  @ApiResponse({
    status: 200, description: 'success'
  })
  createPayment(@Body() dto: PaymentDto) {
    return this.paymentService.payment(dto)
  }

  @Get('byDate')
  getPaymentsByDate() {
    return this.paymentService.getPaymentsByDate()
  }

  @Post('status')
  getPaymentStatus(@Body() dto) {
    return this.paymentService.getPaymentStatus(dto)
  }

  @Get('coinCost')
  getCoinCost() {
    return this.paymentService.getCoinCost()
  }

  @Post('coinCost')
  @ApiResponse({
    status: 200, description: 'success'
  })
  changeCoinCost(@Body() dto: CoinCost) {
    return this.paymentService.changeCoinCost(dto.newCost)
  }

  @ApiResponse({
    status: 200, description: 'success'
  })
  @Post('giveCoins')
  giveCoins(@Body() dto: GiveCoins) {
    return this.paymentService.giveCoins(dto.email, dto.amount)
  }
}
