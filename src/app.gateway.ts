import {
    SubscribeMessage,
    WebSocketGateway,
    OnGatewayInit,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { MessagesService } from './messages/messages.service';
import { PrismaService } from 'src/prisma/prisma.service';

const userIds = {}

@WebSocketGateway(80, {
    cors: {
      origin: '*',
    },
})
export class AppGateway
 implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
 constructor(private messagesService: MessagesService, private prisma: PrismaService) {}
 
 @WebSocketServer() server: Server;
 
 @SubscribeMessage('sendMessage')
 async handleSendMessage(socket: Socket, payload: any): Promise<void> {
   const date = new Date()
   const dateString =  `${date.getHours()}:${date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()}`
   const message = await this.messagesService.createMessage(payload.chatId, payload.senderId, payload.receiverId, payload.text, dateString);
   this.server.emit('recMessage', {...payload, time: dateString, messageId: message.id, newMessage: message });
 }

 @SubscribeMessage('sendSticker')
 async handleSendSticker(socket: Socket, payload: any): Promise<void> {
   const date = new Date()
   const dateString =  `${date.getHours()}:${date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()}`
   const message = await this.messagesService.createMessage(payload.chatId, payload.senderId, payload.receiverId, payload.text, dateString, payload.stickerId);
   this.server.emit('recMessage', {...payload, time: dateString, messageId: message.id, newMessage: message });
 }

 @SubscribeMessage('seeMessage')
 async handleMessageSeen(socket: Socket, payload: any): Promise<void> {
  // console.log(payload, 'asdfasdfasdf')
   const newMessage = await this.prisma.message.update({
    where: {
      id: payload.messageId
    },
    data: {
      seen: true
    }
   })
   this.server.emit('messageSeen', {...payload, newMessage});
 }

 @SubscribeMessage('call')
 async handleCall(socket: Socket, data: any): Promise<void> {
  console.log(data)
  let calleeId = data.calleeId;
  let callerId = data.callerId;
  let rtcMessage = data.rtcMessage;

  console.log(userIds[calleeId])

  this.server.emit("newCall", {
    calleeId,
    callerId,
    rtcMessage,
  });
 }

 @SubscribeMessage('answerCall')
 async handleAnswer(socket: Socket, data: any): Promise<void> {
  console.log(data)
  let callerId = data.callerId;
  let calleeId = data.calleeId;
  let rtcMessage = data.rtcMessage;
  console.log(userIds[callerId])
  this.server.emit("callAnswered", {
        calleeId,
        rtcMessage: rtcMessage,
        callerId
    });
 }

 @SubscribeMessage('ICEcandidate')
 async handleICECandidate(socket: Socket, data: any): Promise<void> {
  console.log(data)
  console.log("ICEcandidate data.calleeId", data.calleeId);
      let calleeId = data.calleeId;
      let rtcMessage = data.rtcMessage;
      let callerId = data.callerId

      this.server.emit("remoteICEcandidate", {
        callerId,
        rtcMessage: rtcMessage,
        calleeId
      });
 }
 
 afterInit(server: Server) {
   console.log('server');
   //Do stuffs
 }
 
 handleDisconnect(socket: Socket) {
   console.log(`Disconnected: ${socket.id}`);
   //Do stuffs
 }
 
 handleConnection(socket: Socket, ...args: any[]) {
    if (socket.handshake.query.callerId && typeof socket.handshake.query.callerId === 'string') {
      userIds[socket.handshake.query.callerId] = socket.id
    }
    console.log(`Connected ${socket.id}`);
    console.log(userIds);
   //Do stuffs
 }
}
