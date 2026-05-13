import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { GroupsModule } from './modules/groups/groups.module';
import { EventsModule } from './modules/events/events.module';
import { ReportsModule } from './modules/reports/reports.module';
import { ChatModule } from './modules/chat/chat.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { AiModule } from './modules/ai/ai.module';
import { PrayersModule } from './modules/prayer/prayer.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { WsModule } from './websocket/ws.module';
import { SermonsModule } from './modules/sermons/sermons.module';
import { ArticlesModule } from './modules/articles/articles.module';
import { UploadModule } from './modules/upload/upload.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env.local', '.env'] }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: process.env.NODE_ENV === 'production' ? 50 : 100 }]),
    ScheduleModule.forRoot(),
    AuthModule, UsersModule, GroupsModule, EventsModule, ReportsModule,
    ChatModule, NotificationsModule, AiModule, PrayersModule, PaymentsModule,
    AnalyticsModule, SermonsModule, ArticlesModule, UploadModule, WsModule,
  ],
})
export class AppModule {}
