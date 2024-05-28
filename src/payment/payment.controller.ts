import { Controller, Post, UsePipes, ValidationPipe, Body, Get } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';
import { PaymentDto, PaymentStatusDto } from './dto';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get()
  getPayments() {
    return this.paymentService.getPayments()
  }

  
  @UsePipes(new ValidationPipe())
  @Post()
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
  changeCoinCost(@Body() dto: { newCost: number }) {
    return this.paymentService.changeCoinCost(dto.newCost)
  }

  @Post('giveCoins')
  giveCoins(@Body() dto: { amount: number, email: string }) {
    return this.paymentService.giveCoins(dto.email, dto.amount)
  }
}
