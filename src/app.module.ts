import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { CanvasModule } from './canvas/canvas.module';
import { LeaderboardModule } from './leaderboard/leaderboard.module';
import { PrismaModule } from './prisma/prisma.module';
import { ScheduleModule } from '@nestjs/schedule';
import { EventsModule } from './events/events.module';
import { GuildModule } from './guild/guild.module';
import { ReportsModule } from './reports/reports.module';
import { AuthMiddleware } from './middleware/auth.middleware';
import { CanvasController } from './canvas/canvas.controller';
import { GuildController } from './guild/guild.controller';
import { ReportsController } from './reports/reports.controller';
import { UsersController } from './users/users.controller';
import { AdminMiddleware } from './middleware/admin.middleware';
import { EmailModule } from './email/email.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [{ ttl: 60000, limit: 100 }],
      errorMessage: 'Too many requests',
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.development',
    }),
    ScheduleModule.forRoot(),
    UsersModule,
    AuthModule,
    CanvasModule,
    LeaderboardModule,
    PrismaModule,
    EventsModule,
    GuildModule,
    ReportsModule,
    EmailModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: 'api/v1/canvas/inspect/{*splat}', method: RequestMethod.POST },
        { path: 'api/v1/canvas/{*splat}', method: RequestMethod.GET },
      )
      .forRoutes(CanvasController);

    consumer
      .apply(AuthMiddleware)
      .forRoutes(GuildController, ReportsController, UsersController);

    consumer
      .apply(AdminMiddleware)
      .forRoutes({ path: 'api/v1/users/all', method: RequestMethod.GET });
  }
}
