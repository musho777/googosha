import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class MessagesService {
    constructor(private prisma: PrismaService) {}

    async createChat(user1Id: number, user2Id: number) {
        const user1 = await this.prisma.user.findUnique({
            where: {
                id: user1Id
            },
            include: {
                user1Chats: true
            }
        })

        

        const chat = await this.prisma.chat.findFirst({
            where: {
                OR: [
                    { user1Id, user2Id },
                    { user1Id: user2Id, user2Id: user1Id },
                    
                ]
            }
        })
        if (!chat) {
            if (!user1.vip && user1.user1Chats.length >= 10) {
                throw new ForbiddenException('No vip status')
            }
            return await this.prisma.chat.create({
                data: {
                    user1: {
                        connect: {
                            id: user1Id
                        }
                    },
                    user2: {
                        connect: {
                            id: user2Id
                        }
                    }
                }
            })
        } else {
            return { exists: true }
        }
    }
    
    async getChats(userId: number) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId
            },
            include: {
                user1Chats: {
                    select: {
                        id: true,
                        user1: true,
                        user2: true,
                        messages: {
                            orderBy: {
                                id: 'asc'
                            }
                        }
                    }
                },
                user2Chats: {
                    select: {
                        id: true,
                        user1: true,
                        user2: true,
                        messages: {
                            orderBy: {
                                id: 'asc'
                            }
                        }
                    }
                },
            }
        })
        return user.user1Chats.concat(user.user2Chats)
    }

    async createMessage(chatId: number, senderId: number, receiverId: number, text: string, time: string, stickerId?: number) {
        const sender = await this.prisma.user.findUnique({
            where: {
                id: senderId
            }
        })

        if (sender.isBanned) throw new ForbiddenException('User banned')

        const newMessage = await this.prisma.message.create({
            data: {
                text,
                
                sender: {
                    connect: {
                        id: senderId
                    }
                },
                receiver: {
                    connect: {
                        id: receiverId
                    }
                },
                time,
                seen: false,
                chat: {
                    connect: {
                        id: chatId
                    }
                },
                sticker: stickerId ? {
                    connect: {
                        id: stickerId
                    }
                } : {}
            }
        })

        await this.prisma.chat.update({
            where: {
                id: chatId
            },
            data: {
                messages: {
                    connect: {
                        id: newMessage.id
                    }
                }
            }
        })

        // console.log(newMessage)

        return newMessage
    }

    async getMessages(chatId: number, userId: number) {
        await this.prisma.message.updateMany({
            where: {
                AND: [

                    {chatId: chatId},
                    {receiverId: userId}
                ]
            },
            data: {
                seen: true
            }
        })

        const messages = await this.prisma.message.findMany({
            where: {
                chatId: chatId
            },
            orderBy: [
                {
                  id: 'asc',
                },
              ],
              include: {
                sticker: true
              }
        })
        // console.log(messages)
        return messages
    }
}
