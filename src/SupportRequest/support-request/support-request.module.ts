import { Module } from '@nestjs/common';
import { SupportRequestService } from './support-request.service';
import { SupportRequestController } from './support-request.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SupportRequest, SupportRequestSchema } from '../schemas/supportRequest.schema';
import { MessageModule } from '../message/message.module';
import { MessageService } from '../message/message.service';
import { AuthUserGuard } from 'src/guards/auth.guard';
import { UsersModule } from 'src/Users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SupportRequest.name, schema: SupportRequestSchema },
    ]),
    SupportRequestModule,
    MessageModule,
    UsersModule,
  ],
  providers: [SupportRequestService, MessageService, AuthUserGuard],
  controllers: [SupportRequestController],
})
export class SupportRequestModule {}
