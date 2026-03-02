/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import type { SendMessageDto } from '../Interfaces/dto/SendMessageDto';
import { SupportRequestService } from './support-request.service';
import { AuthUserGuard } from 'src/guards/auth.guard';

@Controller('/api')
export class SupportRequestController {
  constructor(private readonly supReqSrv: SupportRequestService) {}
  @Post('/client/support-requests/')
  @UseGuards(AuthUserGuard)
  creatingSupportTicket(@Req() req, @Body() data: SendMessageDto) {
    const sessionId = req.session.userId;
    const newBody: SendMessageDto = { ...data };
    newBody.author = sessionId;
    return this.supReqSrv.sendMessage(newBody);
  }
}
