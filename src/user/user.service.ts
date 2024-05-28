import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import * as argon from 'argon2'


const vipCost = {
    '1': 250,
    '3': 700,
    '12': 1000
}

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) {}

    async getGifts(userId: number) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId
            },
            include: {
                gifts: true
            }
        })
        return user.gifts
    }

    async uploadAvatar(userId, filename) {
        const user = await this.prisma.user.update({
            where: {
                id: userId
            },
            data: {
                avatar: filename,
                
            }
        })
    
        return user
    }

    async uploadToGallery(userId, filename) {
        const user = await this.prisma.user.update({
            where: {
                id: userId
            },
            data: {
                gallery: {
                    push: filename
                },
                
            }
        })
    
        return filename
    }

    async getCities() {
        return await this.prisma.city.findMany()
    }

    async buyVipStatusWithCoins(userId: number, type: string) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId
            }
        })

        switch (type) {
            case '1':
                if (user.balance < vipCost['1']) {
                    return new ForbiddenException('Not enough coins')
                } 

                else return await this.prisma.user.update({
                    where: {
                        id: userId
                    },
                    data: {
                        vip: true,
                        vipExpiresAt: (Date.now() + 86400000*31).toString(),
                        balance: user.balance - vipCost['1']
                    }
            })

            case '3':
                if (user.balance < vipCost['3']) {
                    return new ForbiddenException('Not enough coins')
                } 

                else return await this.prisma.user.update({
                    where: {
                        id: userId
                    },
                    data: {
                        vip: true,
                        vipExpiresAt: (Date.now() + 86400000*93).toString(),
                        balance: user.balance - vipCost['3']
                    }
            })

            case '12':
                if (user.balance < vipCost['12']) {
                    return new ForbiddenException('Not enough coins')
                } 

                else return await this.prisma.user.update({
                    where: {
                        id: userId
                    },
                    data: {
                        vip: true,
                        vipExpiresAt: (Date.now() + 86400000*365).toString(),
                        balance: user.balance - vipCost['12']
                    }
            })
        }
    }

    async giveVipStatus(userEmail: string, daysCount: number) {
        const days = Date.now() + 86400000*daysCount

        return await this.prisma.user.update({
            where: {
                email: userEmail
            },
            data: {
                vip: true,
                vipExpiresAt: days.toString()
            }
        })
    }

    async deleteVipStatus(userId: number) {
        return await this.prisma.user.update({
            where: {
                id: userId
            },
            data: {
                vip: false,
                vipExpiresAt: ''
            }
        })
    }

    async updateUser(userId: number, dto: any) {
        if (dto.password) {
            const hash = await argon.hash(dto.password)
            return await this.prisma.user.update({
                where: {
                    id: userId
                },
                data: {
                    hash
                }
            })
        }
        if (dto.cityName) return await this.prisma.user.update({
            where: {
                id: userId
            },
            data: {
                city: {
                    connectOrCreate: {
                        where: {
                            name: dto.cityName
                        },
                        create: {
                            name: dto.cityName
                        }
                    }
                }
            }
        })
        return await this.prisma.user.update({
            where: {
                id: userId
            },
            data: {
                ...dto
            }
        })
    }

    async deleteUser(userId: number) {
        return await this.prisma.user.delete({
            where: {
                id: userId
            }
        })
    }

    async banUser(userId: number, daysCount: number) {
        const days = Date.now() + 86400000*daysCount

        return await this.prisma.user.update({
            where: {
                id: userId
            },
            data: {
                isBanned: true,
                banExpiresAt: days.toString()
            }
        })
    }

    async changeVipCost(type: string, newAmout: number) {
        vipCost[type] = newAmout
        console.log(vipCost)
    }

    async getVipCost(type: string, newAmout: number) {
        return vipCost
    }

    async getUsers() {
        return await this.prisma.user.findMany({})
    }
}