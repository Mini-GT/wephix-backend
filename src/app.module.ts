import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { DiscordModule } from './discord/discord.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: ".env.development"
  }), 
  UsersModule, AuthModule, DiscordModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
