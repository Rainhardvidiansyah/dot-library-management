import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RefreshTokenModule } from 'src/refresh-token/refresh-token.module';

@Module({
  imports: [
    UsersModule,
    RefreshTokenModule,

    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        global: true,
        secret: configService.get<string>('JWT_ACCESS_TOKEN'),
        signOptions: {expiresIn: configService.get<string>('ACCESS_TOKEN_EXPIRY')},
      }),
      inject: [ConfigService],
    }),
  ],

  providers: [AuthenticationService],
  controllers: [AuthenticationController]
})
export class AuthenticationModule {}
