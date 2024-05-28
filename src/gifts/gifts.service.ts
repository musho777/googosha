import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GiftsService {
    constructor(private prisma: PrismaService) {}

    async getGifts() {
        return this.prisma.gift.findMany({})
    }

    async createGift(dto: any) {
        return this.prisma.gift.create({
            data: {
                cost: dto.cost,
                img: '',
                name: dto.name
            }
        })
    }

    async uploadGiftImage(giftId, filename) {
        const gift = await this.prisma.gift.update({
            where: {
                id: giftId
            },
            data: {
                img: filename,
            }
        })
    
        return gift
    }

    async sendGift(giftId: number, userId: number, userToId: number) {
        const gift = await this.prisma.gift.findUnique({
            where: {
                id: giftId
            }
        })

        const user = await this.prisma.user.findUnique({
            where: {
                id: userId
            }
        })

        const userTo = await this.prisma.user.findUnique({
            where: {
                id: userToId
            },
            include: {
                gifts: true
            }
        })

        if (userTo.gifts.includes(gift)) throw new ForbiddenException("User already has this gift")

        if (user.balance < gift.cost) throw new ForbiddenException("Not enough money")

        await this.prisma.user.update({
            where: {
                id: userId
            },
            data: {
                balance: (user.balance - gift.cost)
            }
        })

        return await this.prisma.user.update({
            where: {
                id: userToId
            },
            data: {
                gifts: {
                    connect: {
                        id: giftId
                    }
                },
                userNotifications: {
                    create: {
                        type: 'Gift',
                        user2: {
                            connect: {
                                id: userId
                            }
                        }
                    }
                }
            }
        })
    }
}
