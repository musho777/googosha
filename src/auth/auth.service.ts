import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { SignupDto, SigninDto } from "./dto";
import * as argon from 'argon2'
import * as nodemailer from 'nodemailer'
var Mailgen = require('mailgen');
import { JwtService } from '@nestjs/jwt';
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { ForbiddenException } from "@nestjs/common/exceptions";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwt: JwtService, private config: ConfigService) { }

    async signup(dto: SignupDto) {
        console.log("---+")
        const hash = await argon.hash(dto.password)
        try {
            const user = await this.prisma.user.create({
                data: {
                    email: dto.email,
                    fullName: dto.fullName,
                    phone: dto.phone,
                    city: {
                        connectOrCreate: {
                            where: {
                                name: dto.city
                            },
                            create: {
                                name: dto.city
                            }
                        }
                    },
                    pointOfDate: dto.pointOfDate,
                    familyStatus: dto.familyStatus,
                    info: dto.info,
                    avatar: '',
                    children: dto.children,
                    sex: dto.sex,
                    hash,
                    lat: dto.lat,
                    lon: dto.lon,
                    age: parseInt(dto.age)
                }
            })
            console.log("------++++++")
            return this.signToken(user.id, user.email)
        } catch (e) {
            console.log(e, "eeee")
            if (e instanceof PrismaClientKnownRequestError) {
                if (e.code === 'P2002') throw new ForbiddenException('Credentials taken')
            }
        }
    }

    async recoverPassword(email: string) {
        const user = await this.prisma.user.findUnique({
            where: {
                email
            }
        })

        if (!user) throw new ForbiddenException("Email doesn't exist")

        const code = Math.floor(Math.random() * (9999 - 1000) + 1000).toString()
        const hashCode = await argon.hash(code)

        await this.prisma.user.update({
            where: {
                email
            },
            data: {
                verification: hashCode
            }
        })

        const config = {
            service: 'gmail',
            auth: {
                user: 'vaspupkin976@gmail.com',
                pass: 'bajbpdhdbfjvrddh'
            }
        }

        const transporter = nodemailer.createTransport(config)

        const mailGenerator = new Mailgen({
            theme: 'default',
            product: {
                name: 'Googoosha',
                link: 'https://mailgen.js/'
            }
        })

        const response = {
            body: {
                name: user.fullName,
                intro: 'Your verification code is ' + code
            },
            outro: 'If you did not request a password reset, no further action is required on your part.'
        }

        const mail = mailGenerator.generate(response)

        const message = {
            from: 'vaspupkin976@gmail.com',
            to: email,
            subject: 'Password recovery',
            html: mail
        }

        const res = await transporter.sendMail(message).then(() => { success: 'success' }).catch(e => console.error(e))

        return res
    }

    async sendCode(code: string) {
        const config = {
            service: 'gmail',
            auth: {
                user: 'vaspupkin976@gmail.com',
                pass: 'bajbpdhdbfjvrddh'
            }
        }

        const transporter = nodemailer.createTransport(config)

        const mailGenerator = new Mailgen({
            theme: 'default',
            product: {
                name: 'Googoosha',
                link: 'https://mailgen.js/'
            }
        })

        const response = {
            body: {
                name: 'Aziz',
                intro: 'Code is ' + code
            },
            outro: 'If you did not request a code, no further action is required on your part.'
        }

        const mail = mailGenerator.generate(response)

        const message = {
            from: 'vaspupkin976@gmail.com',
            to: 'Aziz.sharapov3@yandex.ru',
            subject: 'Verification',
            html: mail
        }

        const res = await transporter.sendMail(message).then(() => { success: 'success' }).catch(e => console.error(e))

        return res
    }

    async recoverPasswordSecondStep(code: string, password: string, email: string) {
        const user = await this.prisma.user.findUnique({
            where: {
                email
            }
        })

        if (!user) throw new ForbiddenException('Credentials incorrect')

        const codeMatches = await argon.verify(user.verification, code)

        if (!codeMatches) throw new ForbiddenException("Code is incorrect")

        const newPw = await argon.hash(password)

        await this.prisma.user.update({
            where: { email },
            data: {
                hash: newPw
            }
        })

        return this.signToken(user.id, user.email)
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

        return this.signToken(user.id, user.email)
    }

    async signin(dto: SigninDto, ip: string) {
        console.error(dto, 'askfdjfjsdkjf')
        const user = await this.prisma.user.findUnique({
            where: {
                email: dto.email
            }
        })

        if (!user) throw new ForbiddenException('Credentials incorrect')

        const pwMatches = await argon.verify(user.hash, dto.password)

        if (!pwMatches) throw new ForbiddenException('Credentials incorrect')

        const date = new Date()

        await this.prisma.user.update({
            where: {
                email: dto.email
            },
            data: {
                lastConnects: {
                    push: `${date.getDate()}.${date.getMonth() + 1} ${date.getHours()}:${date.getMinutes()} - ${ip}`
                }
            }
        })

        return this.signToken(user.id, user.email)

    }

    async signToken(userId: number, email: string): Promise<{ access_token: string }> {
        const payload = {
            sub: userId,
            email
        }

        const secret = this.config.get<string>('JWT_SECRET')
        const token = await this.jwt.signAsync(payload, { expiresIn: '3d', secret })

        return ({
            access_token: token
        })
    }
}