import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SupportMessagesService {
    constructor(private prisma: PrismaService) {}

    async getUserMessages(userId: number) {
        return await this.prisma.supportMessage.findMany({
            where: {
                senderId: userId
            }
        })
    }

    async getUsersMessagesByChats() {
        const messages = await this.prisma.supportMessage.findMany({
            include: {
                sender: true
            }
        })

        const chats = {}

        messages.forEach(m => {
            if(chats.hasOwnProperty(m.senderId)) {
                chats[m.senderId].push(m)
            } else {
                chats[m.senderId] = []
                chats[m.senderId].push(m)
            }

        });

        return chats
    }

    async createUserMessage(userId: number, text: string) {
        return await this.prisma.supportMessage.create({
            data: {
                senderId: userId,
                text,
                fromSupport: false
            }
        })
    }

    async createSupportMessage(userToId: number, text: string) {
        return await this.prisma.supportMessage.create({
            data: {
                senderId: userToId,
                text,
                fromSupport: true
            }
        })
    }
}
