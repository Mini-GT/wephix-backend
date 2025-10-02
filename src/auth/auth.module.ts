import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({
      envFilePath: ".env.development"
    }) 
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
