import { Module } from '@nestjs/common';
import { SupportRequestService } from './support-request.service';
import { SupportRequestController } from './support-request.controller';

@Module({
  providers: [SupportRequestService],
  controllers: [SupportRequestController]
})
export class SupportRequestModule {}
