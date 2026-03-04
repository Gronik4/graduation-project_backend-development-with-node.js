/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { SendMessageDto } from '../Interfaces/dto/SendMessageDto';
import { SupportRequestService } from './support-request.service';
import { AuthUserGuard } from 'src/guards/auth.guard';
import type { GetChatListParams } from '../Interfaces/GetChatListParams';
import type { ReplyMessageClient } from '../Interfaces/ReplyMessageClient';
import { ReplyMessageManager } from '../Interfaces/ReplyMessageManager';
import { SupportRequestGuard } from 'src/guards/support-request.guard';
import { ReplySendMessages } from '../Interfaces/ReplySendMessages';
@Controller('/api')
export class SupportRequestController {
  constructor(private readonly supReqSrv: SupportRequestService) {}
  @Post('/client/support-requests/')
  @UseGuards(AuthUserGuard)
  async createMessage(
    @Req() req,
    @Body() data: SendMessageDto,
  ): Promise<ReplyMessageClient> {
    const sessionId = req.session.userId;
    const newBody: SendMessageDto = { ...data };
    newBody.author = sessionId;
    return await this.supReqSrv.sendMessage(newBody);
  }

  @Get('/client/support-requests/')
  @UseGuards(AuthUserGuard)
  async getListClient(
    @Req() req,
    @Query() body: GetChatListParams,
  ): Promise<ReplyMessageClient[] | ReplyMessageManager[] | undefined> {
    const sessId: string = req.session.userId;
    return await this.supReqSrv.findSupportRequests(body, sessId);
  }

  @Get('/manager/support-requests/')
  @UseGuards(AuthUserGuard)
  async getListManager(@Query() params: GetChatListParams) {
    return await this.supReqSrv.findSupportRequests(params, '');
  }

  @Get('/common/support-requests/:id/messages')
  @UseGuards(AuthUserGuard, SupportRequestGuard)
  async getHistoryMessage(@Param('id') id: string): Promise<ReplySendMessages[]> {
    return await this.supReqSrv.getMessages(id);
  }

  @Post('/common/support-requests/:id/messages')
  @UseGuards(AuthUserGuard, SupportRequestGuard)
  async postMessageRequest(
    @Param('id') paramId: string,
    @Body() data: SendMessageDto,
    @Req() req,
  ): Promise<ReplySendMessages[]> {
    const postMReq: SendMessageDto = {
      author: req.session.userId,
      supportRequest: paramId,
      text: data.text,
    };
    return await this.supReqSrv.postMessageRequest(postMReq);
  }
}
