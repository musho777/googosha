import { Controller, Get, UseGuards, ParseIntPipe, Query, Post, Body, Param } from '@nestjs/common';
import { MatchingService } from './matching.service';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Like } from './dto/like.dto';
import { RemoveFromFriends } from './dto/removeFromFriends.dto';

@ApiTags('Matching')
@UseGuards(JwtGuard)
@Controller('matching')
export class MatchingController {
  constructor(private readonly matchingService: MatchingService) { }

  @ApiResponse({
    status: 200, description: 'success'
  })
  @Get('likesFrom')
  getLikesFrom(@GetUser('id', ParseIntPipe) userId: number) {
    return this.matchingService.getLikesFrom(userId)
  }

  @ApiResponse({
    status: 200, description: 'success'
  })
  @Get('likesTo')
  getLikesTo(@GetUser('id', ParseIntPipe) userId: number) {
    return this.matchingService.getLikesTo(userId)
  }

  @ApiResponse({
    status: 200, description: 'success'
  })
  @Get('friends')
  getFriends(@GetUser('id', ParseIntPipe) userId: number) {
    return this.matchingService.getFriends(userId)
  }

  @ApiResponse({
    status: 200, description: 'success'
  })
  @Get('guests')
  getGuests(@GetUser('id', ParseIntPipe) userId: number) {
    return this.matchingService.getGuests(userId)
  }

  @ApiResponse({
    status: 200, description: 'success'
  })
  @Get('city')
  getCities() {
    return this.matchingService.getCities()
  }

  @ApiResponse({
    status: 200, description: 'success'
  })
  @Get(':id')
  getUser(@GetUser('id', ParseIntPipe) userId: number, @Param('id', ParseIntPipe) userToFindId: number) {
    return this.matchingService.getUser(userId, userToFindId)
  }

  @Get()
  findPair(@GetUser('id', ParseIntPipe) userId: number, @Query() queryParams) {
    return this.matchingService.findPair(userId, queryParams)
  }

  @Post('like')
  @ApiResponse({
    status: 200, description: 'success'
  })
  sendLike(@GetUser('id', ParseIntPipe) userId: number, @Body() dto: Like) {
    return this.matchingService.sendLike(userId, dto.id)
  }

  @Post('removeFromFriends')
  @ApiResponse({
    status: 200, description: 'success'
  })
  removeFromFriends(@GetUser('id', ParseIntPipe) userId: number, @Body() dto: RemoveFromFriends) {
    return this.matchingService.removeFromFriends(userId, dto.id)
  }
}
