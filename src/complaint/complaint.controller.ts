import { Controller, Get, Post, Body } from '@nestjs/common';
import { ComplaintService } from './complaint.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateComplaint } from './dto/createComplaint.dto';

@ApiTags('Complaint')
@Controller('complaint')
export class ComplaintController {
  constructor(private readonly complaintService: ComplaintService) { }

  @Get()
  getComplaints() {
    return this.complaintService.getComplaints()
  }

  @Post()
  @ApiResponse({
    status: 200, description: 'success'
  })
  createComplaint(@Body() dto: CreateComplaint) {
    return this.complaintService.createComplaint(dto.messageId, dto.reason)
  }
}
