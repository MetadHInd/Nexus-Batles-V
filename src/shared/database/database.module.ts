import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { FirestoreService } from './firestore.service';
import { FirestoreMessagingService } from './firestore-messaging.service';
import { MessagingHistoryController } from './controllers/messaging-history.controller';

@Global()
@Module({
  controllers: [MessagingHistoryController],
  providers: [
    PrismaService,
    FirestoreService,
    FirestoreMessagingService,
  ],
  exports: [PrismaService, FirestoreService, FirestoreMessagingService],
})
export class DatabaseModule {}
