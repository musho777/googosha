import { Injectable } from '@nestjs/common';
import { PrismaService } from "src/prisma/prisma.service";

function calcCrow(lat1: number, lon1: number, lat2: number, lon2: number) {
    var R = 6371; 
    var dLat = toRad(lat2-lat1);
    var dLon = toRad(lon2-lon1);
    var lat1 = toRad(lat1);
    var lat2 = toRad(lat2);

    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c;
    return d;
}

function toRad(Value: number) {
    return Value * Math.PI / 180;
}

@Injectable()
export class MatchingService {
    constructor(private prisma: PrismaService) {}
 
    async findPair(userId: number, queryParams) {
        this.checkVip(userId)
        this.checkIsBanned(userId)
        const { sex, children, cityName, pointOfDate, distance, ageB = 0, ageT = 100, familyStatus, 
            heightT = 250,
            heightB = 0,
            weightT = 200,
            weightB = 0,
            ownAparts,
            ownCar,
            badHabits,
            moneyCondition,
            education,
            orientation,
            typeOfAppearance,
            religion,
            zodiac,
            eastYear,
            smoking,
            alcohol,
            drugs,
            gambling
        } = queryParams

        const user = await this.prisma.user.findUnique({
            where: {
                id: userId
            },
            include: {
                likesFrom: true,
                likesFromRelation: true
            }
        })
        const userLikesFrom = user.likesFrom.map(u => u.id)
        const userLikesFromRelation = user.likesFromRelation.map(u => u.id)
        if (pointOfDate) {
            const users = await this.prisma.user.findMany({
                where: {
                    NOT: {
                        id: userId
                    },
    
                    children: children ? children : {},
                    sex: sex ? sex == 'true' ? true : false : {},
                    ownAparts: ownAparts ? ownAparts == 'true' ? true : false : {},
                    ownCar: ownCar ? ownCar == 'true' ? true : false : {},
                    badHabits: badHabits ? badHabits == 'true' ? true : false : {},
                    moneyCondition: moneyCondition ? moneyCondition == 'true' ? true : false : {},
                    education: education ? education : {},
                    orientation: orientation ? orientation == 'true' ? true : false : {},

                    smoking: smoking ? smoking == 'true' ? true : false : {},
                    alcohol: alcohol ? alcohol == 'true' ? true : false : {},
                    drugs: drugs ? drugs == 'true' ? true : false : {},
                    gambling: gambling ? gambling == 'true' ? true : false : {},

                    cityName: cityName ? cityName : {},
                    familyStatus: familyStatus ? familyStatus : {},
                    pointOfDate: { hasEvery: pointOfDate },
                    typeOfAppearance: typeOfAppearance ? typeOfAppearance : {},
                    religion: religion ? religion : {},
                    zodiac: zodiac ? zodiac : {},
                    eastYear: eastYear ? eastYear : {},
                    AND: [
                        {
                            age: {
                                lte: parseInt(ageT)
                            },
                            height: {
                                lte: parseInt(heightT)
                            },
                            weight: {
                                lte: parseInt(weightT)
                            }
                        },
                        {
                            age: {
                                gte: parseInt(ageB)
                            },
                            height: {
                                gte: parseInt(heightB)
                            },
                            weight: {
                                gte: parseInt(weightB)
                            }
                        }
                    ],
                }
            })

            const userDistance = distance ? users.filter(u => calcCrow(parseFloat(u.lat), parseFloat(u.lon), parseFloat(user.lat), parseFloat(user.lon)) <= distance) : users

            return userDistance.filter(u => !userLikesFrom.includes(u.id) && !userLikesFromRelation.includes(u.id))
        } else {
            const users = await this.prisma.user.findMany({
                where: {
                    NOT: {
                        id: userId
                    },
    
                    children: children ? children : {},
                    sex: sex ? sex == 'true' ? true : false : {},
                    ownAparts: ownAparts ? ownAparts == 'true' ? true : false : {},
                    ownCar: ownCar ? ownCar == 'true' ? true : false : {},
                    badHabits: badHabits ? badHabits == 'true' ? true : false : {},
                    moneyCondition: moneyCondition ? moneyCondition == 'true' ? true : false : {},
                    education: education ? education : {},
                    orientation: orientation ? orientation == 'true' ? true : false : {},

                    smoking: smoking ? smoking == 'true' ? true : false : {},
                    alcohol: alcohol ? alcohol == 'true' ? true : false : {},
                    drugs: drugs ? drugs == 'true' ? true : false : {},
                    gambling: gambling ? gambling == 'true' ? true : false : {},

                    cityName: cityName ? cityName : {},
                    familyStatus: familyStatus ? familyStatus : {},
                    typeOfAppearance: typeOfAppearance ? typeOfAppearance : {},
                    religion: religion ? religion : {},
                    zodiac: zodiac ? zodiac : {},
                    eastYear: eastYear ? eastYear : {},
                    AND: [
                        {
                            age: {
                                lte: parseInt(ageT)
                            }
                        },
                        {
                            age: {
                                gte: parseInt(ageB)
                            }
                        }
                    ]
                }
            })

            const userDistance = distance ? users.filter(u => calcCrow(parseFloat(u.lat), parseFloat(u.lon), parseFloat(user.lat), parseFloat(user.lon)) <= distance) : users

            return userDistance.filter(u => !userLikesFrom.includes(u.id) && !userLikesFromRelation.includes(u.id))
        }
    }

    async getUser(userId: number, userToFindId: number) {
        await this.prisma.user.update({
            where: {
                id: userToFindId
            },
            data: {
                guests: {
                    connect: {
                        id: userId
                    }
                }
            }
        })

        return await this.prisma.user.findUnique({
            where: {
                id: userToFindId
            },
            include: {
                gifts: true
            }
        })
    }

    async sendLike(userId: number, userToId: number) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId
            },
            include: {
                likesFrom: true
            }
        })

        if (user.likesFrom.map(u => u.id).includes(userToId)) {
            await this.prisma.user.update({
                where: {
                    id: userToId
                },
                data: {
                    likesFrom: {
                        connect: {
                            id: userId
                        }
                    },
                    friends: {
                        connect: {
                            id: userId
                        }
                    },
                    userNotifications: {
                        create: {
                            type: 'Friend',
                            user2: {
                                connect: {
                                    id: userId
                                }
                            }
                        }
                    }
                }
            })

            await this.prisma.user.update({
                where: {
                    id: userId
                },
                data: {
                    friends: {
                        connect: {
                            id: userToId
                        }
                    }
                }
            })
        } else {
            return await this.prisma.user.update({
                where: {
                    id: userToId
                },
                data: {
                    likesFrom: {
                        connect: {
                            id: userId
                        }
                    },
                    userNotifications: {
                        create: {
                            type: 'Like',
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

    async getLikesFrom(userId: number) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId
            },
            include: {
                likesFrom: true,
                friends: true
            },
        })

        const userFriendsIds = user.friends.map(u => u.id)

        return user.likesFrom.filter(u => !userFriendsIds.includes(u.id))
    }

    async getLikesTo(userId: number) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId
            },
            include: {
                likesFromRelation: true,
                friends: true
            },
        })

        const userFriendsIds = user.friends.map(u => u.id)

        return user.likesFromRelation.filter(u => !userFriendsIds.includes(u.id))
    }

    async getFriends(userId: number) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId
            },
            include: {
                friends: true
            },
        })

        return user.friends
    }

    
    async removeFromFriends(userId, userToRemoveId) {
        await this.prisma.user.update({
            where: {
                id: userToRemoveId
            },
            data: {
                likesFrom: {
                    disconnect: {
                        id: userId
                    }
                }
            }
        })
    
        return await this.prisma.user.update({
            where: {
                id: userId
            },
            data: {
                friends: {
                    disconnect: {
                        id: userToRemoveId
                    }
                },
                likesFromRelation: {
                    disconnect: {
                        id: userToRemoveId
                    }
                }
            }
        })
    }

    
    async getGuests(userId: number) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId
            },
            include: {
                guests: true
            },
        })

        return user.guests
    }

    async getCities() {
        return await this.prisma.city.findMany()
    }

    async checkVip(userId: number) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId
            }
        })

        if (user.vip && (Date.now() >= parseInt(user.vipExpiresAt))) {
            this.prisma.user.update({
                where: {
                    id: userId
                },
                data: {
                    vip: false,
                    vipExpiresAt: ''
                }
            })
        }
    }

    async checkIsBanned(userId: number) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId
            }
        })

        if (user.isBanned && (Date.now() >= parseInt(user.banExpiresAt))) {
            this.prisma.user.update({
                where: {
                    id: userId
                },
                data: {
                    isBanned: false,
                    banExpiresAt: ''
                }
            })
        }
    }
}
