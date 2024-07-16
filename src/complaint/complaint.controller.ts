import { Controller, Get, Post, Body } from '@nestjs/common';
import { ComplaintService } from './complaint.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Complaint')
@Controller('complaint')
export class ComplaintController {
  constructor(private readonly complaintService: ComplaintService) { }

  @Get()
  getComplaints() {
    return this.complaintService.getComplaints()
  }

  @Post()
  createComplaint(@Body() dto: { messageId: number, reason: string }) {
    return this.complaintService.createComplaint(dto.messageId, dto.reason)
  }
}
