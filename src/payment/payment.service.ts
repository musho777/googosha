import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as Yookassa from 'yookassa'
import { PaymentDto, PaymentStatusDto } from './dto';

const yooKassa = new Yookassa({
    shopId: "979048",
    secretKey: "test_byC1Xo_cBurc9VxUudN6CmVBvA_OV2awuBI5qSfByXU"
})

let coinCost = 1

@Injectable()
export class PaymentService {
    constructor(private prisma: PrismaService) {}
    
    async payment(dto: PaymentDto) {
        const payment = await yooKassa.createPayment({
            amount: {
              value: (dto.amount * coinCost).toFixed(2),
              currency: "RUB"
            },
            payment_method_data: {
                type: "bank_card"
            },
            confirmation: {
              type: "redirect",
              return_url: "https://www.merchant-website.com/return_url"
            },
            description: `${dto.userId}.${dto.amount}`
        });

        return payment
    }

    async getPaymentStatus(dto: PaymentStatusDto) {
        if (dto.event !== 'payment.waiting_for_capture') return

        const [ id, amount] = dto.object.description.split('.').map(i => parseInt(i))

        const date = new Date()
        const dateString = `${date.getDate()}.${date.getMonth() + 1}`

        await this.prisma.payment.create({
            data: {
                amount,
                date: dateString,
                user: {
                    connect: {
                        id
                    }
                }
            }
        })

        const payment = await yooKassa.capturePayment(
            dto.object.id,
            dto.object.amount
        )

        const user = await this.prisma.user.findUnique({
            where: {
                id
            }
        })

        await this.prisma.user.update({
            where: {
                id
            },
            data: {
                balance: user.balance + amount,
                userNotifications: {
                    create: {
                        type: 'Coins',
                        user2: {
                            connect: {
                                id
                            }
                        }
                    }
                }
            }
        })
    }

    async getPaymentsByDate() {
        const payments = await this.prisma.payment.findMany({})

        const paymentsByDate = {}

        payments.forEach(p => {
            if (paymentsByDate.hasOwnProperty(p.date)) paymentsByDate[p.date] += p.amount
            else paymentsByDate[p.date] = p.amount
        });

        return paymentsByDate
    }

    async getPayments() {
        return await this.prisma.payment.findMany({
            include: {
                user: true
            }
        })
    }

    async getCoinCost() {
        return coinCost
    }

    async changeCoinCost(newCost: number) {
        coinCost = newCost
        console.log(coinCost)
    }

    async giveCoins(userEmail: string, amount: number) {
        const user = await this.prisma.user.findUnique({
            where: {
                email: userEmail
            }
        })

        return await this.prisma.user.update({
            where: {
                email: userEmail
            },
            data: {
                balance: user.balance + amount,
                userNotifications: {
                    create: {
                        type: 'Coins',
                        user2: {
                            connect: {
                                email: userEmail
                            }
                        }
                    }
                }
            }
        })
    }

}
