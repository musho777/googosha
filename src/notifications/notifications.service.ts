import { Injectable } from '@nestjs/common';
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class NotificationsService {
    constructor(private prisma: PrismaService) {}

    async getNotifications(userId: number) {
        await this.prisma.notification.updateMany({
            where: {
                AND: [
                    {userId},
                    {seen: false}
                ]
            },
            data: {
                seen: true
            }
        })

        return this.prisma.notification.findMany({
            where: {
                userId
            },
            include: {
                user2: true
            },
            orderBy: {
                id: 'desc'
            }
        })
    }
}
