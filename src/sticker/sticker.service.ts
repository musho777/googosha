import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class StickerService {
    constructor(private prisma: PrismaService) {}

    async getStickers() {
        return await this.prisma.sticker.findMany({})
    }

    async getUserStickers(userId: number) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId
            },
            include: {
                stickers: true
            }
        })
        return user.stickers
    }

    async getUserAvailableStickers(userId: number) {
        return await this.prisma.sticker.findMany({
            where: {
                NOT: {
                    users: {
                        some: {
                            id: userId
                        }
                    }
                }
            }
        })
    }

    async createSticker(dto: any) {
        return await this.prisma.sticker.create({
            data: {
                name: dto.name,
                img: '',
                cost: dto.cost
            }
        })
    }

    async uploadStickerImage(stickerId, filename) {
        const sticker = await this.prisma.sticker.update({
            where: {
                id: stickerId
            },
            data: {
                img: filename,
            }
        })
    
        return sticker
    }

    async buySticker(stickerId: number, userId: number) {
        const sticker = await this.prisma.sticker.findUnique({
            where: {
                id: stickerId
            }
        })

        const user = await this.prisma.user.findUnique({
            where: {
                id: userId
            }
        })

        if (user.balance < sticker.cost) {
            throw new ForbiddenException("Not enough money")
        }

        return await this.prisma.user.update({
            where: {
                id: userId
            },
            data: {
                balance: (user.balance - sticker.cost),
                stickers: {
                    connect: {
                        id: stickerId
                    }
                },
                userNotifications: {
                    create: {
                        type: 'Sticker',
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
