import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
@Injectable()
export class ComplaintService {
    constructor(private prisma: PrismaService) {}

    async getComplaints() {
        return await this.prisma.complaint.findMany({
            include: {
                message: {
                    select: {
                        sender: true,
                        text: true
                    }
                }
            }
        })
    }

    async createComplaint(messageId: number, reason: string) {
        const message = await this.prisma.message.findUnique({
            where: {
                id: messageId
            }
        })

        return await this.prisma.complaint.create({
            data: {
                message: {
                    connect: {
                        id: messageId
                    }
                },
                reason,
                senderId: message.senderId
            }
        })
    }
}
